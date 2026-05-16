import {
  ContactInfoEditor,
  ContactLinkCreateForm,
  ContactLinkEditorCard,
} from "@/components/dashboard/contact-editor";
import { hasSupabaseServerEnv } from "@/integrations/supabase/server";
import { getPortfolioData } from "@/lib/portfolio/queries";

export default async function DashboardContactPage() {
  const { contactInfo, contactLinks } = await getPortfolioData();
  const isConfigured = hasSupabaseServerEnv();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/6 bg-surface-container-low p-6">
        <h1 className="font-heading text-3xl font-bold text-primary">
          Contact
        </h1>
        <p className="mt-3 text-sm leading-7 text-on-surface-variant">
          Manage the contact page and footer links from one place. These values
          also feed the public home and footer sections.
        </p>
        {!isConfigured ? (
          <p className="mt-3 text-sm text-amber-200">
            Supabase is not configured, so submitting these forms will not
            persist changes yet.
          </p>
        ) : null}
      </div>

      <ContactInfoEditor contactInfo={contactInfo} />

      {contactLinks.map((link) => (
        <ContactLinkEditorCard key={link.id} link={link} />
      ))}

      <ContactLinkCreateForm />
    </div>
  );
}
