export const getPasswordChangeTemplate = () => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contraseña actualizada</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Outfit', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width: 520px; width: 100%;">
          <!-- Logo / Title -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                <span style="color: #ffffff;">Sudoku</span><span style="color: #38bdf8;">Master</span>
              </h1>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background: rgba(30, 41, 59, 0.85); backdrop-filter: blur(16px); border-radius: 24px; padding: 40px 36px; border: 1px solid rgba(255, 255, 255, 0.08);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <!-- Icon -->
                <tr>
                  <td align="center" style="padding-bottom: 8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 64px; height: 64px; background: rgba(56, 189, 248, 0.15); border-radius: 50%;">
                      <tr>
                        <td align="center" style="font-size: 32px; line-height: 64px;">✅</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td align="center" style="padding-bottom: 8px;">
                    <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #f8fafc; letter-spacing: -0.3px;">
                      Contraseña actualizada
                    </h2>
                  </td>
                </tr>

                <!-- Subtitle -->
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <p style="margin: 0; font-size: 15px; color: #94a3b8; line-height: 1.6;">
                      Tu cuenta está segura
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="height: 1px; background: rgba(255, 255, 255, 0.06);"></td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td align="center" style="padding-bottom: 28px;">
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #cbd5e1; line-height: 1.7;">
                      Te informamos que la contraseña de tu cuenta <strong style="color: #38bdf8;">{{ .Email }}</strong> ha sido modificada correctamente.
                    </p>
                    <p style="margin: 0; font-size: 15px; color: #cbd5e1; line-height: 1.7;">
                      Si no has sido tú quien ha realizado este cambio, por favor, ponte en contacto con nuestro equipo de soporte de inmediato para proteger tu cuenta.
                    </p>
                  </td>
                </tr>

                <!-- Footer/Warning -->
                <tr>
                  <td align="center" style="background: rgba(239, 68, 68, 0.1); border-radius: 12px; padding: 16px;">
                    <p style="margin: 0; font-size: 14px; color: #fca5a5; line-height: 1.5;">
                      <strong>¿No fuiste tú?</strong><br/>
                      Si crees que alguien más ha accedido a tu cuenta, recomendamos cerrar sesión en todos los dispositivos y contactar con soporte técnico inmediatamente.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer spacer -->
          <tr>
            <td align="center" style="padding-top: 20px;">
              <p style="margin: 0; font-size: 12px; color: #334155;">
                © 2026 SudokuMaster. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;