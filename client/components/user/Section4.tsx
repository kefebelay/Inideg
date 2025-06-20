"use client";

import React from "react";
import { ShieldCheck, Rocket, Users } from "lucide-react";

export default function Section4() {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: "Trusted & Secure",
      desc: "Your data is protected with industry-grade security. We prioritize your safety and privacy.",
    },
    {
      icon: <Rocket className="w-6 h-6 text-white" />,
      title: "Fast Growth",
      desc: "Reach new audiences quickly. Our platform boosts your visibility and performance.",
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Community Driven",
      desc: "Join a network of businesses and customers built on collaboration and trust.",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-muted to-muted/80 text-foreground py-24 px-6 md:px-20">
      <div className="max-w-6xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Why Choose Our Platform?
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Built to scale with your business — fast, secure, and connected.
        </p>

        <div className="mt-16 grid gap-10 grid-cols-1 md:grid-cols-3 place-items-center">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300 ease-in-out hover:-translate-y-1"
            >
              <div className="flex  justify-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary/70 mb-5">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
