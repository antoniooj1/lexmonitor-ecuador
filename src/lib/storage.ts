import type {
  Alert,
  Deadline,
  Document as LegalDocument,
  JudicialAction,
  JudicialProcess,
  Note,
  NotificationSettings,
  User
} from "@/types";
import { DEMO_USER_ID } from "@/lib/constants";
import {
  mockDeadlines,
  mockDocuments,
  mockNotes,
  mockProcesses,
  mockActionsByProcessNumber
} from "@/data/mockSatjeData";
import { mockAlerts } from "@/data/mockAlerts";
import { getSupabaseClient } from "@/lib/supabaseClient";

interface AuthUserLike {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: {
    name?: string;
  };
}

interface ProcessRow {
  id: string;
  user_id: string;
  process_number: string;
  court: string;
  province: string;
  canton: string;
  matter: string;
  process_type: string;
  actors: string | null;
  defendants: string | null;
  current_status: string;
  last_action: string | null;
  last_action_date: string | null;
  satje_source_url: string | null;
  monitoring_enabled: boolean;
  last_checked_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ActionRow {
  id: string;
  process_id: string;
  action_date: string;
  action_type: string;
  raw_text: string;
  ai_summary: string | null;
  suggested_action: string | null;
  urgency_level: string;
  has_deadline: boolean;
  detected_deadline_text: string | null;
  tentative_due_date: string | null;
  confirmed_due_date: string | null;
  reviewed: boolean;
  created_at: string;
}

interface AlertRow {
  id: string;
  process_id: string;
  action_id: string | null;
  title: string;
  description: string;
  urgency_level: string;
  suggested_action: string | null;
  due_date: string | null;
  status: string;
  reviewed_at: string | null;
  created_at: string;
  judicial_processes?: { process_number?: string } | Array<{ process_number?: string }> | null;
  judicial_actions?: { action_type?: string } | Array<{ action_type?: string }> | null;
}

interface DeadlineRow {
  id: string;
  process_id: string;
  action_id: string | null;
  deadline_type: string;
  detected_text: string | null;
  tentative_due_date: string | null;
  confirmed_due_date: string | null;
  manually_adjusted: boolean;
  status: string;
  created_at: string;
}

interface NoteRow {
  id: string;
  process_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface DocumentRow {
  id: string;
  process_id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
}

interface SettingsRow {
  id: string;
  user_id: string;
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  push_enabled: boolean;
  urgent_alerts_enabled: boolean;
  daily_summary_enabled: boolean;
  created_at: string;
  updated_at: string;
}

const STORAGE_PREFIX = "lexmonitor-ecuador";

const keys = {
  user: `${STORAGE_PREFIX}:user`,
  portfolio: `${STORAGE_PREFIX}:portfolio`,
  alerts: `${STORAGE_PREFIX}:alerts`,
  actions: `${STORAGE_PREFIX}:actions`,
  deadlines: `${STORAGE_PREFIX}:deadlines`,
  notes: `${STORAGE_PREFIX}:notes`,
  documents: `${STORAGE_PREFIX}:documents`,
  settings: `${STORAGE_PREFIX}:settings`
};

const initialPortfolio = mockProcesses.slice(0, 3);
const initialActions = Object.values(mockActionsByProcessNumber).flat();

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  const value = window.localStorage.getItem(key);
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function splitPeople(value: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toUrgencyLevel(value: string | null | undefined): JudicialProcess["urgencyLevel"] {
  return value === "alta" || value === "media" || value === "baja" ? value : "baja";
}

function toProcess(row: ProcessRow, relatedAlerts: Alert[] = []): JudicialProcess {
  const processAlerts = relatedAlerts.filter((alert) => alert.processId === row.id);
  const urgentAlert = processAlerts.find((alert) => alert.urgencyLevel === "alta");
  const mediumAlert = processAlerts.find((alert) => alert.urgencyLevel === "media");
  const mainAlert = urgentAlert ?? mediumAlert ?? processAlerts[0];

  return {
    id: row.id,
    userId: row.user_id,
    processNumber: row.process_number,
    court: row.court,
    province: row.province,
    canton: row.canton,
    matter: row.matter,
    processType: row.process_type,
    actors: splitPeople(row.actors),
    defendants: splitPeople(row.defendants),
    currentStatus: row.current_status as JudicialProcess["currentStatus"],
    lastAction: row.last_action ?? "Sin actuación registrada.",
    lastActionDate: row.last_action_date ?? row.created_at.slice(0, 10),
    satjeSourceUrl: row.satje_source_url ?? "",
    monitoringEnabled: row.monitoring_enabled,
    lastCheckedAt: row.last_checked_at ?? row.updated_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    urgencyLevel: mainAlert?.urgencyLevel ?? "baja",
    nextPendingAction: mainAlert?.suggestedAction ?? row.last_action ?? "Revisar el expediente y mantener monitoreo.",
    activeAlertsCount: processAlerts.filter((alert) => alert.status === "pendiente").length
  };
}

function toProcessRow(process: JudicialProcess, userId: string) {
  return {
    id: process.id,
    user_id: userId,
    process_number: process.processNumber,
    court: process.court,
    province: process.province,
    canton: process.canton,
    matter: process.matter,
    process_type: process.processType,
    actors: process.actors.join(", "),
    defendants: process.defendants.join(", "),
    current_status: process.currentStatus,
    last_action: process.lastAction,
    last_action_date: process.lastActionDate,
    satje_source_url: process.satjeSourceUrl,
    monitoring_enabled: process.monitoringEnabled,
    last_checked_at: process.lastCheckedAt,
    created_at: process.createdAt,
    updated_at: process.updatedAt
  };
}

function toAction(row: ActionRow): JudicialAction {
  return {
    id: row.id,
    processId: row.process_id,
    actionDate: row.action_date,
    actionType: row.action_type,
    rawText: row.raw_text,
    aiSummary: row.ai_summary ?? "",
    suggestedAction: row.suggested_action ?? "",
    urgencyLevel: toUrgencyLevel(row.urgency_level),
    hasDeadline: row.has_deadline,
    detectedDeadlineText: row.detected_deadline_text,
    tentativeDueDate: row.tentative_due_date,
    confirmedDueDate: row.confirmed_due_date,
    reviewed: row.reviewed,
    createdAt: row.created_at,
    generatedAlert: false
  };
}

function toActionRow(action: JudicialAction) {
  return {
    id: action.id,
    process_id: action.processId,
    action_date: action.actionDate,
    action_type: action.actionType,
    raw_text: action.rawText,
    ai_summary: action.aiSummary,
    suggested_action: action.suggestedAction,
    urgency_level: action.urgencyLevel,
    has_deadline: action.hasDeadline,
    detected_deadline_text: action.detectedDeadlineText,
    tentative_due_date: action.tentativeDueDate,
    confirmed_due_date: action.confirmedDueDate,
    reviewed: action.reviewed,
    created_at: action.createdAt
  };
}

function relationOne<T>(value: T | T[] | null | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : value ?? undefined;
}

function toAlert(row: AlertRow): Alert {
  return {
    id: row.id,
    processId: row.process_id,
    actionId: row.action_id ?? "",
    title: row.title,
    description: row.description,
    urgencyLevel: toUrgencyLevel(row.urgency_level),
    suggestedAction: row.suggested_action ?? "",
    dueDate: row.due_date,
    status: row.status === "revisada" ? "revisada" : "pendiente",
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
    processNumber: relationOne(row.judicial_processes)?.process_number,
    actionType: relationOne(row.judicial_actions)?.action_type
  };
}

function toAlertRow(alert: Alert) {
  return {
    id: alert.id,
    process_id: alert.processId,
    action_id: alert.actionId || null,
    title: alert.title,
    description: alert.description,
    urgency_level: alert.urgencyLevel,
    suggested_action: alert.suggestedAction,
    due_date: alert.dueDate,
    status: alert.status,
    reviewed_at: alert.reviewedAt,
    created_at: alert.createdAt
  };
}

function toDeadline(row: DeadlineRow): Deadline {
  return {
    id: row.id,
    processId: row.process_id,
    actionId: row.action_id ?? "",
    deadlineType: row.deadline_type,
    detectedText: row.detected_text ?? "",
    tentativeDueDate: row.tentative_due_date,
    confirmedDueDate: row.confirmed_due_date,
    manuallyAdjusted: row.manually_adjusted,
    status: row.status as Deadline["status"],
    createdAt: row.created_at
  };
}

function toDeadlineRow(deadline: Deadline) {
  return {
    id: deadline.id,
    process_id: deadline.processId,
    action_id: deadline.actionId || null,
    deadline_type: deadline.deadlineType,
    detected_text: deadline.detectedText,
    tentative_due_date: deadline.tentativeDueDate,
    confirmed_due_date: deadline.confirmedDueDate,
    manually_adjusted: deadline.manuallyAdjusted,
    status: deadline.status,
    created_at: deadline.createdAt
  };
}

function toNote(row: NoteRow): Note {
  return {
    id: row.id,
    processId: row.process_id,
    userId: row.user_id,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toDocument(row: DocumentRow): LegalDocument {
  return {
    id: row.id,
    processId: row.process_id,
    userId: row.user_id,
    fileName: row.file_name,
    fileUrl: row.file_url,
    fileType: row.file_type,
    uploadedAt: row.uploaded_at
  };
}

function toSettings(row: SettingsRow): NotificationSettings {
  return {
    id: row.id,
    userId: row.user_id,
    emailEnabled: row.email_enabled,
    whatsappEnabled: row.whatsapp_enabled,
    pushEnabled: row.push_enabled,
    urgentAlertsEnabled: row.urgent_alerts_enabled,
    dailySummaryEnabled: row.daily_summary_enabled,
    preferredHour: "08:00",
    alertTypes: ["Todas", "Audiencia", "Citación", "Providencia"],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function generateUuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "10000000-1000-4000-8000-000000000000".replace(/[018]/g, (char) =>
    (Number(char) ^ (Math.random() * 16) >> (Number(char) / 4)).toString(16)
  );
}

async function getAuthUser(): Promise<AuthUserLike | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

export async function hasSupabaseSession() {
  return Boolean(await getAuthUser());
}

export async function ensureUserProfile(authUser: AuthUserLike, name?: string) {
  const supabase = getSupabaseClient();
  if (!supabase || !authUser.email) return;

  await supabase.from("users").upsert({
    id: authUser.id,
    name: name ?? authUser.user_metadata?.name ?? authUser.email.split("@")[0],
    email: authUser.email,
    role: "lawyer",
    created_at: authUser.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}

export function getCurrentUser(): User {
  return readJson<User>(keys.user, {
    id: DEMO_USER_ID,
    name: "Equipo Legal Demo",
    email: "demo@lexmonitor.ec",
    role: "lawyer",
    createdAt: "2026-06-01T08:00:00.000Z"
  });
}

export async function getCurrentUserAsync(): Promise<User> {
  const authUser = await getAuthUser();
  if (!authUser?.email) return getCurrentUser();

  const supabase = getSupabaseClient();
  if (!supabase) return getCurrentUser();

  const { data } = await supabase.from("users").select("*").eq("id", authUser.id).maybeSingle();
  const row = data as { id: string; name: string; email: string; role: User["role"]; created_at: string } | null;

  if (!row) {
    await ensureUserProfile(authUser);
    return {
      id: authUser.id,
      name: authUser.user_metadata?.name ?? authUser.email.split("@")[0],
      email: authUser.email,
      role: "lawyer",
      createdAt: authUser.created_at ?? new Date().toISOString()
    };
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at
  };
}

export function saveCurrentUser(user: User) {
  writeJson(keys.user, user);
}

export async function getPortfolioAsync(): Promise<JudicialProcess[]> {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return getPortfolio();

  const [processResponse, alertList] = await Promise.all([
    supabase.from("judicial_processes").select("*").eq("user_id", authUser.id).order("updated_at", {
      ascending: false
    }),
    getAlertsAsync()
  ]);

  if (processResponse.error) return getPortfolio();
  return ((processResponse.data ?? []) as unknown as ProcessRow[]).map((row) => toProcess(row, alertList));
}

export function getPortfolio(): JudicialProcess[] {
  return readJson<JudicialProcess[]>(keys.portfolio, initialPortfolio);
}

export function savePortfolio(processes: JudicialProcess[]) {
  writeJson(keys.portfolio, processes);
}

export async function savePortfolioAsync(processes: JudicialProcess[]) {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) {
    savePortfolio(processes);
    return processes;
  }

  const rows = processes.map((process) => toProcessRow(process, authUser.id));
  const { error } = await supabase.from("judicial_processes").upsert(rows);
  if (error) {
    savePortfolio(processes);
  }
  return processes;
}

export function addProcessesToPortfolio(processes: JudicialProcess[]) {
  const existing = getPortfolio();
  const existingIds = new Set(existing.map((process) => process.id));
  const added = processes.filter((process) => !existingIds.has(process.id));
  const merged = [...existing, ...added];
  savePortfolio(merged);
  return {
    portfolio: merged,
    addedCount: added.length,
    existingCount: processes.length - added.length
  };
}

export async function addProcessesToPortfolioAsync(processes: JudicialProcess[]) {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return addProcessesToPortfolio(processes);

  await ensureUserProfile(authUser);
  const existing = await getPortfolioAsync();
  const existingIds = new Set(existing.map((process) => process.id));
  const added = processes.filter((process) => !existingIds.has(process.id));

  if (added.length) {
    await supabase.from("judicial_processes").upsert(
      added.map((process) => toProcessRow({ ...process, userId: authUser.id }, authUser.id))
    );

    const actions = added.flatMap((process) => mockActionsByProcessNumber[process.processNumber] ?? []);
    const alerts = mockAlerts.filter((alert) => added.some((process) => process.id === alert.processId));
    const deadlines = mockDeadlines.filter((deadline) =>
      added.some((process) => process.id === deadline.processId)
    );

    if (actions.length) await supabase.from("judicial_actions").upsert(actions.map(toActionRow));
    if (alerts.length) await supabase.from("alerts").upsert(alerts.map(toAlertRow));
    if (deadlines.length) await supabase.from("deadlines").upsert(deadlines.map(toDeadlineRow));
  }

  return {
    portfolio: await getPortfolioAsync(),
    addedCount: added.length,
    existingCount: processes.length - added.length
  };
}

export function toggleProcessMonitoring(processId: string) {
  const portfolio = getPortfolio().map((process) =>
    process.id === processId
      ? { ...process, monitoringEnabled: !process.monitoringEnabled, updatedAt: new Date().toISOString() }
      : process
  );
  savePortfolio(portfolio);
  return portfolio;
}

export async function toggleProcessMonitoringAsync(processId: string) {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return toggleProcessMonitoring(processId);

  const portfolio = await getPortfolioAsync();
  const target = portfolio.find((process) => process.id === processId);
  if (!target) return portfolio;

  await supabase
    .from("judicial_processes")
    .update({
      monitoring_enabled: !target.monitoringEnabled,
      updated_at: new Date().toISOString()
    })
    .eq("id", processId)
    .eq("user_id", authUser.id);

  return getPortfolioAsync();
}

export function getActions(): JudicialAction[] {
  return readJson<JudicialAction[]>(keys.actions, initialActions);
}

export async function getActionsAsync(): Promise<JudicialAction[]> {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return getActions();

  const { data, error } = await supabase
    .from("judicial_actions")
    .select("*, judicial_processes!inner(user_id)")
    .eq("judicial_processes.user_id", authUser.id)
    .order("action_date", { ascending: false });

  if (error) return getActions();
  return ((data ?? []) as unknown as ActionRow[]).map(toAction);
}

export function saveActions(actions: JudicialAction[]) {
  writeJson(keys.actions, actions);
}

export function appendActions(actions: JudicialAction[]) {
  const existing = getActions();
  const existingIds = new Set(existing.map((action) => action.id));
  const merged = [...actions.filter((action) => !existingIds.has(action.id)), ...existing];
  saveActions(merged);
  return merged;
}

export async function appendActionsAsync(actions: JudicialAction[]) {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return appendActions(actions);

  const rows = actions.map((action) => toActionRow({ ...action, id: action.id || generateUuid() }));
  const { error } = await supabase.from("judicial_actions").upsert(rows);
  if (error) return appendActions(actions);
  return getActionsAsync();
}

export function getAlerts(): Alert[] {
  return readJson<Alert[]>(keys.alerts, mockAlerts);
}

export async function getAlertsAsync(): Promise<Alert[]> {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return getAlerts();

  const { data, error } = await supabase
    .from("alerts")
    .select("*, judicial_processes!inner(process_number,user_id), judicial_actions(action_type)")
    .eq("judicial_processes.user_id", authUser.id)
    .order("created_at", { ascending: false });

  if (error) return getAlerts();
  return ((data ?? []) as unknown as AlertRow[]).map(toAlert);
}

export function saveAlerts(alerts: Alert[]) {
  writeJson(keys.alerts, alerts);
}

export async function saveAlertsAsync(alerts: Alert[]) {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) {
    saveAlerts(alerts);
    return alerts;
  }

  const { error } = await supabase.from("alerts").upsert(alerts.map(toAlertRow));
  if (error) saveAlerts(alerts);
  return alerts;
}

export function appendAlerts(alerts: Alert[]) {
  const existing = getAlerts();
  const existingIds = new Set(existing.map((alert) => alert.id));
  const merged = [...alerts.filter((alert) => !existingIds.has(alert.id)), ...existing];
  saveAlerts(merged);
  return merged;
}

export async function appendAlertsAsync(alerts: Alert[]) {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return appendAlerts(alerts);

  const rows = alerts.map((alert) => toAlertRow({ ...alert, id: alert.id || generateUuid() }));
  const { error } = await supabase.from("alerts").upsert(rows);
  if (error) return appendAlerts(alerts);
  return getAlertsAsync();
}

export function markAlertAsReviewed(alertId: string) {
  const alerts = getAlerts().map((alert) =>
    alert.id === alertId
      ? { ...alert, status: "revisada" as const, reviewedAt: new Date().toISOString() }
      : alert
  );
  saveAlerts(alerts);
  return alerts;
}

export async function markAlertAsReviewedAsync(alertId: string) {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return markAlertAsReviewed(alertId);

  await supabase
    .from("alerts")
    .update({ status: "revisada", reviewed_at: new Date().toISOString() })
    .eq("id", alertId);

  return getAlertsAsync();
}

export function getDeadlines(): Deadline[] {
  return readJson<Deadline[]>(keys.deadlines, mockDeadlines);
}

export async function getDeadlinesAsync(): Promise<Deadline[]> {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return getDeadlines();

  const { data, error } = await supabase
    .from("deadlines")
    .select("*, judicial_processes!inner(user_id)")
    .eq("judicial_processes.user_id", authUser.id)
    .order("tentative_due_date", { ascending: true });

  if (error) return getDeadlines();
  return ((data ?? []) as unknown as DeadlineRow[]).map(toDeadline);
}

export function saveDeadlines(deadlines: Deadline[]) {
  writeJson(keys.deadlines, deadlines);
}

export function confirmDeadline(deadlineId: string, confirmedDueDate: string) {
  const deadlines = getDeadlines().map((deadline) =>
    deadline.id === deadlineId
      ? {
          ...deadline,
          confirmedDueDate,
          manuallyAdjusted: true,
          status: "confirmado" as const
        }
      : deadline
  );
  saveDeadlines(deadlines);
  return deadlines;
}

export async function confirmDeadlineAsync(deadlineId: string, confirmedDueDate: string) {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return confirmDeadline(deadlineId, confirmedDueDate);

  await supabase
    .from("deadlines")
    .update({
      confirmed_due_date: confirmedDueDate,
      manually_adjusted: true,
      status: "confirmado"
    })
    .eq("id", deadlineId);

  return getDeadlinesAsync();
}

export function getNotes(): Note[] {
  return readJson<Note[]>(keys.notes, mockNotes);
}

export async function getNotesAsync(): Promise<Note[]> {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return getNotes();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", authUser.id)
    .order("created_at", { ascending: false });

  if (error) return getNotes();
  return ((data ?? []) as unknown as NoteRow[]).map(toNote);
}

export function saveNotes(notes: Note[]) {
  writeJson(keys.notes, notes);
}

export function addNote(processId: string, content: string) {
  const now = new Date().toISOString();
  const note: Note = {
    id: `note-${Date.now()}`,
    processId,
    userId: getCurrentUser().id,
    content,
    createdAt: now,
    updatedAt: now
  };
  const notes = [note, ...getNotes()];
  saveNotes(notes);
  return notes;
}

export async function addNoteAsync(processId: string, content: string) {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return addNote(processId, content);

  const now = new Date().toISOString();
  await supabase.from("notes").insert({
    id: generateUuid(),
    process_id: processId,
    user_id: authUser.id,
    content,
    created_at: now,
    updated_at: now
  });

  return getNotesAsync();
}

export function getDocuments(): LegalDocument[] {
  return readJson<LegalDocument[]>(keys.documents, mockDocuments);
}

export async function getDocumentsAsync(): Promise<LegalDocument[]> {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return getDocuments();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", authUser.id)
    .order("uploaded_at", { ascending: false });

  if (error) return getDocuments();
  return ((data ?? []) as unknown as DocumentRow[]).map(toDocument);
}

export function saveDocuments(documents: LegalDocument[]) {
  writeJson(keys.documents, documents);
}

export function addDocument(processId: string, fileName: string, fileType: string) {
  const document: LegalDocument = {
    id: `doc-${Date.now()}`,
    processId,
    userId: getCurrentUser().id,
    fileName,
    fileUrl: "#",
    fileType,
    uploadedAt: new Date().toISOString()
  };
  const documents = [document, ...getDocuments()];
  saveDocuments(documents);
  return documents;
}

export async function addDocumentAsync(processId: string, fileName: string, fileType: string) {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return addDocument(processId, fileName, fileType);

  await supabase.from("documents").insert({
    id: generateUuid(),
    process_id: processId,
    user_id: authUser.id,
    file_name: fileName,
    file_url: "#",
    file_type: fileType,
    uploaded_at: new Date().toISOString()
  });

  return getDocumentsAsync();
}

export function getNotificationSettings(): NotificationSettings {
  return readJson<NotificationSettings>(keys.settings, {
    id: "settings-demo",
    userId: DEMO_USER_ID,
    emailEnabled: true,
    whatsappEnabled: false,
    pushEnabled: false,
    urgentAlertsEnabled: true,
    dailySummaryEnabled: true,
    preferredHour: "08:00",
    alertTypes: ["Todas", "Audiencia", "Citación", "Providencia"],
    createdAt: "2026-06-01T08:00:00.000Z",
    updatedAt: "2026-06-01T08:00:00.000Z"
  });
}

export async function getNotificationSettingsAsync(): Promise<NotificationSettings> {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) return getNotificationSettings();

  const { data, error } = await supabase
    .from("notification_settings")
    .select("*")
    .eq("user_id", authUser.id)
    .maybeSingle();

  if (error || !data) return getNotificationSettings();
  return toSettings(data as unknown as SettingsRow);
}

export function saveNotificationSettings(settings: NotificationSettings) {
  writeJson(keys.settings, {
    ...settings,
    updatedAt: new Date().toISOString()
  });
}

export async function saveNotificationSettingsAsync(settings: NotificationSettings) {
  const authUser = await getAuthUser();
  const supabase = getSupabaseClient();
  if (!supabase || !authUser) {
    saveNotificationSettings(settings);
    return;
  }

  await supabase.from("notification_settings").upsert({
    id: settings.id === "settings-demo" ? generateUuid() : settings.id,
    user_id: authUser.id,
    email_enabled: settings.emailEnabled,
    whatsapp_enabled: settings.whatsappEnabled,
    push_enabled: settings.pushEnabled,
    urgent_alerts_enabled: settings.urgentAlertsEnabled,
    daily_summary_enabled: settings.dailySummaryEnabled,
    updated_at: new Date().toISOString()
  });
}
