import React from "react";
import { ShieldCheck, Rocket, Users } from "lucide-react";

export default function Section4() {
  return (
    <section className="w-full bg-muted text-foreground py-20 px-4 md:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-semibold mb-6">
          Why Choose Our Platform?
        </h2>
        <p className="text-base md:text-lg text-muted-foreground mb-12">
          Designed to help your business grow with speed, visibility, and
          reliability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Feature 1 */}
          <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
            <ShieldCheck className="text-primary w-10 h-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Trusted & Secure</h3>
            <p className="text-muted-foreground">
              Your data is protected with best-in-class security. We prioritize
              your safety and privacy.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
            <Rocket className="text-primary w-10 h-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast Growth</h3>
            <p className="text-muted-foreground">
              Reach new audiences quickly and efficiently. Our platform is
              optimized for visibility and performance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
            <Users className="text-primary w-10 h-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-muted-foreground">
              Join a growing network of businesses and customers built on trust
              and collaboration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
