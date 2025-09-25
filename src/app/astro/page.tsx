import { redirect } from 'next/navigation';

export default function AstroIndex() {
  // Server-side redirect to the Janma Details page
  redirect('/astro/janma');
}
