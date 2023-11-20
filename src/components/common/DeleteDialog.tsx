import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

interface IDeleteDialogProps {
  open?: boolean;
  onClose?: (confirmed: boolean) => void;
  itemName?: string;
}

function DeleteDialog(props: IDeleteDialogProps) {
  const { open, onClose = (_val) => {}, itemName = 'Item' } = props;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this {itemName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action acnnot be undone. This will permanently delete your data
            from our server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" size="sm" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onClose(true)}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteDialog;
