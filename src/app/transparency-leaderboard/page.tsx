import CompanyTransparencyLeaderboardPage from "@/components/transparency/CompanyTransparencyLeaderboardPage";
import { transparencyLeaderboard } from "@/data/mockTransparencyLeaderboard";

export default function Page() {
  return <CompanyTransparencyLeaderboardPage data={transparencyLeaderboard} />;
}
