import { ModeToggle } from "@/components/ui/modeToggle";
import Login from "../app/login/page";

export default function Home() {
  return (
    <div>
        <div style={{ position: "absolute", bottom: "15px", right: "15px", zIndex: 1000 }}>
          <ModeToggle />
        </div>
        <Login />
    </div>
  );
}
