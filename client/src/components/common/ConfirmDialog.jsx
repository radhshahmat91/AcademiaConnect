import Modal from './Modal';

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', description, confirmLabel = 'Delete' }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {description && <p className="text-sm text-ink-muted">{description}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button
          className="btn-danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
