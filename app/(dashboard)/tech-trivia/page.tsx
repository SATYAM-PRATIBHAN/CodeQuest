import TechTrivia from "@/components/main/trivia";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function WhiteBoardPage() {
    return (
        <div className="bg-[#0D1117] flex flex-col items-center justify-center h-screen">
            <TechTrivia/>
            <BackgroundBeams/>
        </div>
    );
}
