import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

type FloatingAddButtonProps = { onClick: () => void }

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return <Button className="add-task-button floating-add-button" onClick={onClick}><Plus size={18} strokeWidth={2.5} /><span>Add a task</span></Button>
}
