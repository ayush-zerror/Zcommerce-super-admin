import { addToast, Button, Card, CardBody, Input, Switch } from "@heroui/react";
import { useRef, useState } from "react";

export function PlatformSettingsTab() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [senderName, setSenderName] = useState("Zcommerce Platform");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const onFileChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      addToast({
        title: "Invalid file",
        description: "Please upload an image file.",
        color: "danger",
      });
      return;
    }
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  };

  return (
    <div className="space-y-4">
      <Card shadow="none">
        <CardBody className="gap-4 p-4 sm:p-5">
          <div>
            <h3 className="text-base font-semibold">Branding</h3>
            <p className="text-xs text-default-500">
              Logo upload is preview-only in this demo
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-default-100">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-default-400">Logo</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
              />
              <Button variant="flat" onPress={() => fileRef.current?.click()}>
                Upload logo
              </Button>
              {logoPreview ? (
                <Button
                  variant="light"
                  color="danger"
                  onPress={() => setLogoPreview(null)}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          </div>
        </CardBody>
      </Card>

      <Card shadow="none">
        <CardBody className="gap-4 p-4 sm:p-5">
          <Input
            label="Email sender name"
            value={senderName}
            onValueChange={setSenderName}
          />
          <div className="space-y-3">
            <p className="text-sm font-semibold">Notification preferences</p>
            <Switch isSelected={emailAlerts} onValueChange={setEmailAlerts}>
              Email alerts for failed payments
            </Switch>
            <Switch isSelected={slackAlerts} onValueChange={setSlackAlerts}>
              Slack alerts for suspensions
            </Switch>
            <Switch isSelected={weeklyDigest} onValueChange={setWeeklyDigest}>
              Weekly platform digest
            </Switch>
          </div>
          <div className="flex justify-end">
            <Button
              color="primary"
              onPress={() =>
                addToast({
                  title: "Platform settings saved",
                  description: "Local demo preferences updated.",
                  color: "success",
                })
              }
            >
              Save settings
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
