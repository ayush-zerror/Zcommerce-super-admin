import {
  addToast,
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { Plus, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { currentAdmin } from "../../lib/mockData";
import { useAuth } from "../../providers/AuthProvider";
import { secondaryButtonClassName } from "./buttonStyles";

const teams = [
  { id: "t1", initial: "A", color: "bg-primary" },
  { id: "t2", initial: "M", color: "bg-secondary" },
  { id: "t3", initial: "R", color: "bg-danger" },
] as const;

export function ProfileDropdown() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const handle = "zerror-studios";

  return (
    <Popover placement="bottom-end" offset={12}>
      <PopoverTrigger>
        <Button
          variant="flat"
          radius="sm"
          className="h-9 gap-2.5 bg-[#3a3a3a] px-2.5 text-white data-[hover=true]:bg-[#4a4a4a]"
        >
          <span className="hidden text-sm font-medium sm:inline">{handle}</span>
          <Avatar
            name={currentAdmin.avatarInitials}
            size="sm"
            radius="sm"
            classNames={{
              base: "bg-primary text-white h-7 w-7 min-w-7",
              name: "text-[10px] font-bold",
            }}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] overflow-hidden rounded-2xl border border-default-200 p-0 shadow-lg">
        <div className="w-full bg-content1">
          <div className="px-4 pb-3 pt-3">
            <p className="mb-3 text-xs text-default-400">
              Currently In {currentAdmin.name}
            </p>
            <div className="flex items-center gap-3">
              <Avatar
                name={currentAdmin.avatarInitials}
                classNames={{
                  base: "bg-primary text-white h-11 w-11",
                  name: "text-sm font-bold",
                }}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {handle}
                </p>
                <p className="truncate text-xs text-default-400">
                  {currentAdmin.email}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-default-200 px-4 py-3">
            <p className="mb-2 text-xs text-default-400">Teams</p>
            <div className="flex items-center">
              {teams.map((team, index) => (
                <Avatar
                  key={team.id}
                  name={team.initial}
                  classNames={{
                    base: `${team.color} text-white h-8 w-8 border-2 border-content1 ${
                      index > 0 ? "-ml-2" : ""
                    }`,
                    name: "text-xs font-bold",
                  }}
                />
              ))}
              <Button
                isIconOnly
                radius="full"
                size="sm"
                variant="flat"
                aria-label="Add team"
                className="-ml-2 h-8 w-8 min-w-8 bg-default-200 text-foreground"
                onPress={() =>
                  addToast({
                    title: "Add team",
                    description: "Team invite is demo-only.",
                    color: "primary",
                  })
                }
              >
                <Plus size={14} strokeWidth={2.5} />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-default-200 px-4 py-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
              onClick={() => navigate("/settings/users")}
            >
              <Settings size={16} fill="currentColor" strokeWidth={0} />
              Account Settings
            </button>
            <Button
              size="sm"
              radius="full"
              variant="bordered"
              color="primary"
              className={secondaryButtonClassName}
              onPress={() => {
                signOut();
                addToast({
                  title: "Logged out",
                  description: "You have been signed out.",
                  color: "warning",
                });
                navigate("/sign-in", { replace: true });
              }}
            >
              Log Out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
