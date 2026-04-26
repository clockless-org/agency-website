import Dashboard from './Dashboard'
import ChatBubble from './ChatBubble'
import type { PortalMember, PortalTenantIdentity } from './api'

const DEMO_MEMBER: PortalMember = {
  id: 'demo-tide-and-tonic',
  name: 'Tide & Tonic',
  email: 'camilla@tideandtonic.example',
  tenant: 'aperture-ink',
}

const DEMO_TENANT: PortalTenantIdentity = {
  slug: 'aperture-ink',
  name: 'Aperture & Ink',
  agent_name: 'Reese Okonkwo',
  agent_avatar_url: null,
  agent_bio: 'Founder & ECD at Aperture & Ink. We built this portal so every revision lives in one place.',
}

export default function App() {
  return (
    <>
      <Dashboard member={DEMO_MEMBER} tenant={DEMO_TENANT} onSignOut={() => { window.location.href = '/' }} />
      <ChatBubble tenant={DEMO_TENANT} />
    </>
  )
}
