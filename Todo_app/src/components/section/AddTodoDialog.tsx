import { useEffect, useRef, type FormEvent } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type AddTodoDialogProps = { open: boolean; title: string; onTitleChange: (title: string) => void; onClose: () => void; onSubmit: (event: FormEvent) => void }

export function AddTodoDialog({ open, title, onTitleChange, onClose, onSubmit }: AddTodoDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (open) inputRef.current?.focus() }, [open])
  if (!open) return null
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="add-modal" onSubmit={onSubmit}><button type="button" className="modal-close" aria-label="Close" onClick={onClose}><X size={18} /></button><span className="modal-icon"><Plus size={18} /></span><div className="section-kicker">MAKE IT HAPPEN</div><h2>Add a task</h2><p>What would you like to get done?</p><label className="modal-label" htmlFor="task-title">TASK TITLE</label><input ref={inputRef} id="task-title" value={title} onChange={(event) => onTitleChange(event.target.value)} placeholder="e.g. Sketch out the new landing page" maxLength={100} /><div className="modal-actions"><button type="button" className="cancel-button" onClick={onClose}>Cancel</button><Button type="submit" className="add-task-button" disabled={!title.trim()}><Plus size={16} /> Create task</Button></div></form></div>
}
