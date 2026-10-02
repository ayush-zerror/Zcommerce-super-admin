import { useClients } from "../providers/ClientsProvider";
import { ClientsPageContent } from "../components/clients/ClientsPageContent";

export function Clients() {
  const { clients } = useClients();
  return <ClientsPageContent clients={clients} />;
}
