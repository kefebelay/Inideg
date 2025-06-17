import React from "react";
import Image from "next/image";

export default function Section2() {
  return (
    <section className="w-full  py-16 px-4 md:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Illustration */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/images/feature-illustration.png"
            alt="Platform features"
            width={500}
            height={400}
            className="w-full max-w-md md:max-w-full rounded-xl shadow-xl bg-white/20"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-semibold mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-6">
            We provide tools and visibility your business needs to thrive in a
            competitive market. Whether you're a startup or an established
            brand, our platform is designed to grow with you.
          </p>
          <ul className="space-y-4 text-slate-700 dark:text-slate-300 text-left">
            <li className="flex items-start gap-2">
              ✅ <span>Easy-to-use dashboard for managing your profile</span>
            </li>
            <li className="flex items-start gap-2">
              ✅ <span>Advanced analytics to track engagement</span>
            </li>
            <li className="flex items-start gap-2">
              ✅ <span>Customizable listings to highlight your services</span>
            </li>
            <li className="flex items-start gap-2">
              ✅ <span>Customer reviews and ratings to build trust</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
