import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Crown, Castle } from "lucide-react";

export default function CreditsPage() {
  const credits = [
    {
      title: "EXECUTIVE PRODUCER",
      people: ["JOHN REESE"]
    },
    {
      title: "CREATOR & DIRECTOR", 
      people: ["JOHN REESE"]
    },
    {
      title: "OWNER",
      people: ["JOHN REESE"]
    },
    {
      title: "MENTORS",
      people: ["WONDER BOY", "ROOT", "SARAHI"]
    },
    {
      title: "TECHNICAL DIRECTOR",
      people: ["JOHN REESE"]
    },
    {
      title: "LEAD DEVELOPER",
      people: ["JOHN REESE"]
    },
    {
      title: "SECURITY CONSULTANT",
      people: ["CIPHER SPECIALIST"]
    },
    {
      title: "NETWORK ENGINEER", 
      people: ["PHANTOM ADMIN"]
    },
    {
      title: "UI/UX DESIGNER",
      people: ["DIGITAL ARCHITECT"]
    },
    {
      title: "QUALITY ASSURANCE",
      people: ["BETA TESTERS COLLECTIVE"]
    },
    {
      title: "COMMUNITY MANAGER",
      people: ["SOCIAL GUARDIAN"]
    },
    {
      title: "SPECIAL THANKS",
      people: ["THE COMMUNITY MEMBERS", "BETA TESTERS", "FEEDBACK CONTRIBUTORS"]
    }
  ];

  return (
    <DashboardLayout title="Credits">
      <div className="space-y-8">
        {/* Credits Movie-Style Display */}
        <div className="bg-gradient-to-b from-gray-900 to-black text-white rounded-xl overflow-hidden min-h-[600px] relative">
          {/* Background Stars Effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-10 right-10 w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>

          <div className="relative z-10 p-8 text-center">
            {/* Header */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-10 w-10 text-yellow-900" />
              </div>
              <h1 className="text-4xl font-bold mb-2">COMMUNITY HUB</h1>
              <p className="text-xl text-gray-300">Production Credits</p>
            </div>

            {/* Credits List */}
            <div className="max-w-2xl mx-auto space-y-8">
              {credits.map((credit, index) => (
                <div key={index} className="space-y-4 py-4">
                  <h2 className="text-2xl font-bold text-yellow-400">{credit.title}</h2>
                  <div className="space-y-2">
                    {credit.people.map((person, personIndex) => (
                      <p key={personIndex} className="text-xl text-white">
                        {person}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Company Section */}
              <div className="space-y-4 py-8 border-t border-gray-700">
                <h2 className="text-3xl font-bold text-yellow-400">COMPANY</h2>
                <p className="text-2xl font-bold">REESE EMPIRE</p>
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mt-4">
                  <Castle className="h-8 w-8 text-yellow-900" />
                </div>
              </div>

              {/* Final Credits */}
              <div className="py-12 border-t border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">A REESE EMPIRE PRODUCTION</h2>
                <p className="text-lg text-gray-300">© 2025 All Rights Reserved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Behind the Scenes */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Behind the Scenes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technologies Used</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• React & TypeScript for frontend</li>
                <li>• Node.js & Express for backend</li>
                <li>• PostgreSQL for database</li>
                <li>• WebSocket for real-time features</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Nodemailer for email services</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Stats</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Development time: 30+ hours</li>
                <li>• Lines of code: 5000+</li>
                <li>• Features implemented: 15+</li>
                <li>• Database tables: 8</li>
                <li>• API endpoints: 25+</li>
                <li>• React components: 20+</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Thanks */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Special Thanks</h2>
          <p className="text-lg text-blue-100 mb-4">
            To all community members who made this platform possible
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div>
              <p className="font-semibold">John Reese</p>
              <p className="text-blue-200">Visionary & Creator</p>
            </div>
            <div>
              <p className="font-semibold">The Community</p>
              <p className="text-blue-200">Users & Supporters</p>
            </div>
            <div>
              <p className="font-semibold">Beta Testers</p>
              <p className="text-blue-200">Quality Assurance</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
