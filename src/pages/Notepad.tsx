import { useUser } from "@/components/UserContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, Save, PlusCircle, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { Note, getNotes, createNote, updateNote, deleteNote } from "@/integrations/api/client";

export default function NotepadPage() {
  const { profile, loading: userLoading } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; noteId: string | null }>({
    open: false,
    noteId: null,
  });

  // Fetch notes on mount or login
  useEffect(() => {
    if (!profile?.id) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    getNotes(token)
      .then((data) => {
        setNotes(data);
        setLoading(false);
      })
      .catch((err) => {
        toast({ title: "Unable to load notes", description: err.message });
        setLoading(false);
      });
  }, [profile?.id]);

  // Create new note
  const handleCreate = async () => {
    if (!form.title.trim() && !form.content.trim()) {
      toast({ title: "Note empty", description: "Can't save an empty note." });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast({ title: "Not authenticated", description: "Please sign in to create notes." });
      return;
    }

    setCreating(true);
    try {
      const note = await createNote(token, form.title, form.content);
      setNotes([note, ...notes]);
      setForm({ title: "", content: "" });
      setActiveNote(note);
      toast({ title: "Note saved!" });
    } catch (err: any) {
      toast({ title: "Failed to save", description: err.message });
    }
    setCreating(false);
  };

  // Edit note
  const handleEdit = (note: Note) => {
    setActiveNote(note);
    setForm({ title: note.title, content: note.content });
  };

  // Update note
  const handleUpdate = async () => {
    if (!activeNote) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast({ title: "Not authenticated", description: "Please sign in to update notes." });
      return;
    }

    setSaving(true);
    try {
      const updatedNote = await updateNote(token, activeNote._id, form.title, form.content);
      setNotes((prev) =>
        prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
      );
      setActiveNote(updatedNote);
      toast({ title: "Note updated!" });
    } catch (err: any) {
      toast({ title: "Failed to update", description: err.message });
    }
    setSaving(false);
  };

  // Delete note
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({ title: "Not authenticated", description: "Please sign in to delete notes." });
      return;
    }

    setDeleteDialog({ open: false, noteId: null });
    try {
      await deleteNote(token, id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      if (activeNote?._id === id) {
        setActiveNote(null);
        setForm({ title: "", content: "" });
      }
      toast({ title: "Note deleted" });
    } catch (err: any) {
      toast({ title: "Failed to delete", description: err.message });
    }
  };

  const handleCancelEdit = () => {
    setActiveNote(null);
    setForm({ title: "", content: "" });
  };

  if (userLoading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg mt-20 border rounded-lg bg-background p-6 flex flex-col items-center gap-5 shadow">
        <h2 className="text-xl font-bold text-primary">Notepad</h2>
        <p className="text-muted-foreground">
          Please <span className="font-semibold">sign in</span> to take notes.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-2 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar: Notes List */}
      <aside className="w-full md:w-1/3 lg:w-1/4 bg-card border rounded-xl shadow-sm p-4 flex flex-col gap-4 h-[70vh] md:h-[80vh] overflow-y-auto sticky top-8">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="font-bold text-lg flex-1">My Notes</h2>
          <Button size="icon" variant="ghost" onClick={handleCancelEdit} title="New Note">
            <PlusCircle className="w-5 h-5" />
          </Button>
        </div>
        <Input
          placeholder="Search notes..."
          className="mb-2"
          onChange={e => {
            const val = e.target.value.toLowerCase();
            setNotes(notes => notes.map(n => ({ ...n, _search: n.title.toLowerCase().includes(val) || n.content.toLowerCase().includes(val) })));
          }}
        />
        <div className="flex-1 flex flex-col gap-2">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
          ) : notes.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No notes yet.</div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className={`rounded-lg px-3 py-2 cursor-pointer transition-all border flex flex-col gap-1 shadow-sm bg-background/80 hover:bg-accent/40 ${activeNote?._id === note._id ? "border-primary bg-primary/10" : "border-transparent"}`}
                onClick={() => handleEdit(note)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate flex-1">{note.title || "Untitled"}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={e => { e.stopPropagation(); setDeleteDialog({ open: true, noteId: note._id }); }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground truncate">{note.content}</span>
                <span className="text-[10px] text-muted-foreground">{new Date(note.updated_at).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main: Note Editor */}
      <main className="flex-1 bg-card border rounded-xl shadow-lg p-6 flex flex-col gap-4 min-h-[70vh] relative">
        <div className="flex items-center gap-2 sticky top-0 bg-card z-10 pb-2 mb-2 border-b">
          <Link to="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold flex-1">{activeNote ? "Edit Note" : "New Note"}</h1>
        </div>
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          className="text-lg font-semibold px-4 py-3 rounded-md border border-input bg-background mb-2"
        />
        <Textarea
          placeholder="Write your note here..."
          value={form.content}
          onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
          className="resize-y min-h-[220px] max-h-[50vh] px-4 py-3 rounded-md border border-input bg-background text-base shadow-inner focus:ring-2 focus:ring-primary/30 transition-all"
        />
        <div className="flex justify-end gap-2 sticky bottom-0 bg-card pt-4 pb-2 z-10">
          {activeNote ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create
                </>
              )}
            </Button>
          )}
        </div>
      </main>

      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, noteId: null })}
        onConfirm={() => deleteDialog.noteId && handleDelete(deleteDialog.noteId)}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        trigger={<Button variant="ghost" size="icon" className="hidden"><Trash2 className="w-4 h-4 text-destructive" /></Button>}
      />
    </div>
  );
}
