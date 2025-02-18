import { ModeToggle } from "@/components/ui/modeToggle";
import Login from "../app/login/page";

export default function Home() {
  return (
    <div>
        <Login />
        <div style={{ position: "absolute", top: "15px", right: "15px", zIndex: 1000 }}>
            <ModeToggle />
          </div>
    </div>
  );
}
