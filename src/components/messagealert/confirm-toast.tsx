import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ConfirmToastProps {
  message: string;
  onConfirm: () => void;
}

export const showConfirmToast = ({
  message,
  onConfirm,
}: ConfirmToastProps) => {
  const toastId = toast.info(
    <div style={{ 
      padding: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      width: '320px'
    }}>
      <div style={{ 
        fontSize: '16px', 
        fontWeight: 600, 
        color: '#2d3748', 
        marginBottom: '8px' 
      }}>
        Are you sure?
      </div>
      <div style={{ 
        fontSize: '14px', 
        color: '#718096', 
        marginBottom: '16px',
        lineHeight: '1.4'
      }}>
        {message}
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '8px' 
      }}>
        <button 
          onClick={() => toast.dismiss(toastId)}
          style={{
            padding: '6px 12px',
            background: 'transparent',
            color: '#4a5568',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#f7fafc';
            e.currentTarget.style.borderColor = '#cbd5e0';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          Cancel
        </button>
        <button 
          onClick={() => {
            toast.dismiss(toastId);
            onConfirm();
          }}
          style={{
            padding: '6px 12px',
            background: '#e53e3e',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#c53030'}
          onMouseOut={(e) => e.currentTarget.style.background = '#e53e3e'}
        >
          Yes, delete it!
        </button>
      </div>
    </div>,
    {
      autoClose: false,
      closeButton: true, // Adiciona o botão de fechar padrão
      position: 'top-center',
      style: { 
        width: 'auto',
        minWidth: '320px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        backgroundColor: 'white',
        padding: '0',
        margin: '0'
      },
      closeOnClick: true, // Fecha ao clicar fora
      draggable: true, // Permite arrastar para fechar
      onClick: () => toast.dismiss(toastId) // Fecha ao clicar no toast
    }
  );

  
};