"use client";

import { useEffect, useMemo, useState } from "react";
import { FilePlus, StickyNote } from "lucide-react";
import type { Document as LegalDocument, JudicialProcess, Note } from "@/types";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  addDocumentAsync,
  addNoteAsync,
  getDocumentsAsync,
  getNotesAsync,
  getPortfolioAsync
} from "@/lib/storage";
import { formatDateTime } from "@/lib/utils";

export default function DocumentsPage() {
  const [processes, setProcesses] = useState<JudicialProcess[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [processId, setProcessId] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("PDF");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadDocumentsData() {
      const [portfolio, noteData, documentData] = await Promise.all([
        getPortfolioAsync(),
        getNotesAsync(),
        getDocumentsAsync()
      ]);
      setProcesses(portfolio);
      setProcessId(portfolio[0]?.id ?? "");
      setNotes(noteData);
      setDocuments(documentData);
    }

    void loadDocumentsData();
  }, []);

  const processOptions = [
    { label: "Seleccione un proceso", value: "" },
    ...processes.map((process) => ({
      label: `${process.processNumber} · ${process.matter}`,
      value: process.id
    }))
  ];

  const scopedNotes = useMemo(
    () => notes.filter((note) => !processId || note.processId === processId),
    [notes, processId]
  );

  const scopedDocuments = useMemo(
    () => documents.filter((document) => !processId || document.processId === processId),
    [documents, processId]
  );

  const onAddNote = () => {
    if (!processId || !noteContent.trim()) return;
    void addNoteAsync(processId, noteContent.trim()).then((nextNotes) => {
      setNotes(nextNotes);
      setNoteContent("");
      setMessage("Nota interna agregada.");
    });
  };

  const onAddDocument = () => {
    if (!processId || !fileName.trim()) return;
    void addDocumentAsync(processId, fileName.trim(), fileType).then((nextDocuments) => {
      setDocuments(nextDocuments);
      setFileName("");
      setMessage("Documento simulado agregado.");
    });
  };

  return (
    <AppShell title="Notas y documentos" subtitle="Gestión interna asociada a procesos">
      <div className="space-y-6">
        {message ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-semibold text-success">
            {message}
          </div>
        ) : null}
        <Card>
          <CardContent>
            <Select
              label="Filtrar por proceso"
              value={processId}
              onChange={(event) => setProcessId(event.target.value)}
              options={processOptions}
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <h2 className="flex items-center gap-2 text-base font-bold text-ink">
                <StickyNote className="h-5 w-5 text-navy" aria-hidden="true" />
                Agregar nota interna
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label="Nota"
                value={noteContent}
                onChange={(event) => setNoteContent(event.target.value)}
                placeholder="Detalle interno, tarea pendiente o estrategia procesal..."
              />
              <Button onClick={onAddNote}>Agregar nota</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="flex items-center gap-2 text-base font-bold text-ink">
                <FilePlus className="h-5 w-5 text-navy" aria-hidden="true" />
                Simular carga de documento
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Nombre del archivo"
                value={fileName}
                onChange={(event) => setFileName(event.target.value)}
                placeholder="providencia-10-junio.pdf"
              />
              <Select
                label="Tipo"
                value={fileType}
                onChange={(event) => setFileType(event.target.value)}
                options={[
                  { label: "PDF", value: "PDF" },
                  { label: "DOCX", value: "DOCX" },
                  { label: "XLSX", value: "XLSX" },
                  { label: "Imagen", value: "Imagen" }
                ]}
              />
              <Button onClick={onAddDocument}>Simular carga</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <h2 className="text-base font-bold text-ink">Notas internas</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {scopedNotes.length ? (
                scopedNotes.map((note) => (
                  <div key={note.id} className="rounded-md bg-slate-50 p-3">
                    <p className="text-sm text-ink">{note.content}</p>
                    <p className="mt-2 text-xs text-muted">{formatDateTime(note.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-md bg-slate-50 p-4 text-sm text-muted">
                  Sin notas internas para el proceso seleccionado.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-base font-bold text-ink">Documentos asociados</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {scopedDocuments.length ? (
                scopedDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3"
                  >
                    <div>
                      <p className="font-semibold text-ink">{document.fileName}</p>
                      <p className="text-xs text-muted">{formatDateTime(document.uploadedAt)}</p>
                    </div>
                    <Badge variant="slate">{document.fileType}</Badge>
                  </div>
                ))
              ) : (
                <p className="rounded-md bg-slate-50 p-4 text-sm text-muted">
                  Sin documentos asociados al proceso seleccionado.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
