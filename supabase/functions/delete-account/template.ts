export const getAccountDeletedTemplate = (email: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Cuenta eliminada</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Outfit', sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width: 520px; width: 100%;">
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800;"><span style="color: #ffffff;">Sudoku</span><span style="color: #38bdf8;">Master</span></h1>
            </td>
          </tr>
          <tr>
            <td style="background: rgba(30, 41, 59, 0.85); border-radius: 24px; padding: 40px 36px; border: 1px solid rgba(255, 255, 255, 0.08);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <table role="presentation" style="width: 64px; height: 64px; background: rgba(239, 68, 68, 0.15); border-radius: 50%;">
                      <tr><td align="center" style="font-size: 32px;">🗑️</td></tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 8px;">
                    <h2 style="margin: 0; color: #f8fafc;">Cuenta eliminada</h2>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <p style="margin: 0; color: #94a3b8; line-height: 1.6;">Hemos procesado tu solicitud</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 28px; color: #cbd5e1; line-height: 1.7;">
                    <p>Hola,</p>
                    <p>Te confirmamos que la cuenta asociada a <strong>${email}</strong> ha sido eliminada permanentemente de SudokuMaster, junto con todos tus datos y estadísticas.</p>
                    <p>Sentimos verte partir. ¡Esperamos volver a verte pronto!</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
