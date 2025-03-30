import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  const { number } = useParams<{ number: string }>();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <ModalUI
      data-cy='modal'
      title={`${title} ${number ? number : ''}`}
      onClose={onClose}
    >
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement
  );
});
