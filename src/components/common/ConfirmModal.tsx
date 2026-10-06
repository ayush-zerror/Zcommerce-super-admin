import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import {
  modalCancelButtonClassName,
  modalPrimaryButtonClassName,
} from "./buttonStyles";
import { dashboardModalProps } from "./modalStyles";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: "danger" | "primary" | "warning" | "success";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      {...dashboardModalProps}
    >
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <p className="text-sm leading-relaxed text-default-500">
                {description}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                radius="full"
                className={modalCancelButtonClassName}
                onPress={close}
              >
                {cancelLabel}
              </Button>
              <Button
                color={confirmColor}
                radius="full"
                className={modalPrimaryButtonClassName}
                isLoading={isLoading}
                onPress={() => {
                  onConfirm();
                  close();
                }}
              >
                {confirmLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
