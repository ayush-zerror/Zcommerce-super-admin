import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clients as initialClients } from "../lib/mockData";
import type { Client, ClientStatus } from "../types";

interface ClientsContextValue {
  clients: Client[];
  getClient: (id: string) => Client | undefined;
  addClient: (client: Client) => void;
  updateClient: (id: string, patch: Partial<Client>) => void;
  setClientStatus: (id: string, status: ClientStatus) => void;
  deleteClient: (id: string) => void;
}

const ClientsContext = createContext<ClientsContextValue | null>(null);

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients);

  const getClient = useCallback(
    (id: string) => clients.find((client) => client.id === id),
    [clients],
  );

  const addClient = useCallback((client: Client) => {
    setClients((prev) => [client, ...prev]);
  }, []);

  const updateClient = useCallback((id: string, patch: Partial<Client>) => {
    setClients((prev) =>
      prev.map((client) => (client.id === id ? { ...client, ...patch } : client)),
    );
  }, []);

  const setClientStatus = useCallback((id: string, status: ClientStatus) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id
          ? {
              ...client,
              status,
              mrr: status === "suspended" ? 0 : client.mrr,
            }
          : client,
      ),
    );
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      clients,
      getClient,
      addClient,
      updateClient,
      setClientStatus,
      deleteClient,
    }),
    [addClient, clients, deleteClient, getClient, setClientStatus, updateClient],
  );

  return (
    <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>
  );
}

export function useClients(): ClientsContextValue {
  const ctx = useContext(ClientsContext);
  if (!ctx) {
    throw new Error("useClients must be used within ClientsProvider");
  }
  return ctx;
}
