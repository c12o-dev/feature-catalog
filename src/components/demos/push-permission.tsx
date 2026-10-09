"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Bell, BellOff, BellRing, Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Perm = NotificationPermission | "unsupported" | "unknown";

function subscribe(cb: () => void) {
  let status: PermissionStatus | null = null;
  let cancelled = false;
  navigator.permissions
    ?.query({ name: "notifications" as PermissionName })
    .then((s) => {
      if (cancelled) return;
      status = s;
      s.addEventListener("change", cb);
    })
    .catch(() => {});
  return () => {
    cancelled = true;
    status?.removeEventListener("change", cb);
  };
}
const getSnapshot = (): Perm => ("Notification" in window ? Notification.permission : "unsupported");
const getServerSnapshot = (): Perm => "unknown";

const permLabel: Record<Perm, string> = {
  default: "未確認",
  granted: "許可",
  denied: "ブロック",
  unsupported: "非対応",
  unknown: "確認中",
};

export default function PushPermission() {
  const browserPerm = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // in-app soft prompt state, separate from the browser's own permission
  const [soft, setSoft] = useState<"ask" | "snoozed">("ask");
  // when the API is unavailable we simulate the browser's answer
  const [simPerm, setSimPerm] = useState<NotificationPermission>("default");
  const [requested, setRequested] = useState<NotificationPermission | null>(null);
  const [banner, setBanner] = useState(false);

  const supported = browserPerm !== "unsupported" && browserPerm !== "unknown";
  const perm: NotificationPermission = supported ? (requested ?? (browserPerm as NotificationPermission)) : simPerm;

  useEffect(() => {
    if (!banner) return;
    const id = setTimeout(() => setBanner(false), 4000);
    return () => clearTimeout(id);
  }, [banner]);

  const enable = async () => {
    if (!supported) {
      setSimPerm("granted");
      return;
    }
    try {
      const result = await Notification.requestPermission();
      setRequested(result);
    } catch {
      setRequested(Notification.permission);
    }
  };

  const sendTest = () => {
    setBanner(true);
    if (supported && perm === "granted") {
      try {
        new Notification("Tsumiki", { body: "佐藤さんがあなたをメンションしました", tag: "demo-push" });
      } catch {
        /* some browsers only allow notifications from a service worker */
      }
    }
  };

  const reset = () => {
    setSoft("ask");
    setSimPerm("default");
    setRequested(null);
  };

  return (
    <div className="relative mx-auto w-full max-w-md">
      {banner && (
        <div
          role="status"
          className="absolute inset-x-2 top-2 z-10 flex items-start gap-2.5 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg"
        >
          <div className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
            <BellRing className="size-4" />
          </div>
          <div className="min-w-0 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Tsumiki</span>
              <span className="text-xs text-muted-foreground">今</span>
            </div>
            <p className="truncate text-muted-foreground">佐藤さんがあなたをメンションしました</p>
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
            {perm === "denied" ? (
              <BellOff className="size-5 text-muted-foreground" />
            ) : soft === "snoozed" && perm === "default" ? (
              <Clock className="size-5 text-muted-foreground" />
            ) : (
              <Bell className="size-5 text-primary" />
            )}
          </div>
          <div className="min-w-0 flex-1" aria-live="polite">
            {perm === "default" && soft === "ask" && (
              <>
                <div className="text-sm font-medium">メンションを見逃さないように</div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  通知をオンにすると、レビュー依頼や返信をすぐにお知らせします。
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" onClick={enable}>通知をオンにする</Button>
                  <Button size="sm" variant="ghost" onClick={() => setSoft("snoozed")}>後で</Button>
                </div>
              </>
            )}
            {perm === "default" && soft === "snoozed" && (
              <>
                <div className="text-sm font-medium">あとでもう一度お聞きします</div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  ブラウザの許可はまだ求めていません。3 日後か、次に返信が届いたときに再表示します。
                </p>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setSoft("ask")}>今すぐ設定する</Button>
              </>
            )}
            {perm === "granted" && (
              <>
                <div className="text-sm font-medium">通知はオンです</div>
                <p className="mt-0.5 text-xs text-muted-foreground">OS の通知センターにお届けします。</p>
                <Button size="sm" variant="outline" className="mt-3" onClick={sendTest}>
                  <BellRing /> テスト通知を送る
                </Button>
              </>
            )}
            {perm === "denied" && (
              <>
                <div className="text-sm font-medium">通知はブロックされています</div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  再度オンにするには、アドレスバーのサイト設定から「通知」を許可してください。
                </p>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
          <span>
            ブラウザの許可: <span className="font-medium text-foreground">{permLabel[supported ? perm : browserPerm]}</span>
            {!supported && browserPerm === "unsupported" && "（模擬表示）"}
          </span>
          <button type="button" onClick={reset} className="inline-flex items-center gap-1 rounded px-1 hover:text-foreground">
            <RotateCcw className="size-3" /> 最初から
          </button>
        </div>
      </div>
    </div>
  );
}
