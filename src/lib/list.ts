// MOCK — stores nothing; every signup is discarded. Replace the body with a real
// provider call (Mailchimp, Buttondown, ...) before the site goes to real fans.
export async function joinList(_email: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 600))
}
