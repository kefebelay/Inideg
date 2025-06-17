import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function AboutContactSection() {
  return (
    <section className="w-full bg-background text-foreground py-20 px-4 md:px-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {/* About Us */}
        <div>
          <h2 className="text-2xl md:text-4xl font-semibold mb-4">About Us</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            We are a passionate team committed to helping businesses stand out
            online. Our mission is to empower entrepreneurs by connecting them
            to the right audience through modern, accessible technology. Whether
            you're just starting out or scaling up, our platform is built to
            grow with you.
          </p>
        </div>

        {/* Contact Us */}
        <div>
          <h2 className="text-2xl md:text-4xl font-semibold mb-4">
            Contact Us
          </h2>
          <p className="text-muted-foreground mb-4">
            Have questions or need support? Reach out — we’re here to help.
          </p>
          <ul className="space-y-2 text-base">
            <li>
              <span className="font-medium">Email:</span> inideg@gmail.com
            </li>
            <li>
              <span className="font-medium">Phone:</span> +251 912 345 678
            </li>
            <li>
              <span className="font-medium">Address:</span> Addis Ababa,
              Ethiopia
            </li>
          </ul>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center mt-16">
        <Link
          href="/signup"
          className={buttonVariants({ variant: "default", size: "lg" })}
        >
          Promote Your Business Now
        </Link>
      </div>
    </section>
  );
}
