export function GoogleLoginButton({ status, session, onSignIn, onSignOut }) {
  if (status === 'loading') {
    return <button type="button" disabled>Carregando...</button>
  }

  if (session) {
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span>Olá, {session.user?.name}</span>
        <button type="button" onClick={onSignOut}>Sair</button>
      </div>
    )
  }

  return <button type="button" onClick={onSignIn}>Entrar com Google</button>
}
