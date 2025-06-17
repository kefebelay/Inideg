import React from "react";
import Image from "next/image";

export default function Section3() {
  return (
    <section className="w-full bg-background text-foreground py-16 px-4 md:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-semibold mb-6">
          Hear From Our Happy Users
        </h2>
        <p className="text-base md:text-lg text-muted-foreground mb-12">
          Trusted by businesses of all sizes. Here's what people are saying
          about our platform.
        </p>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-card text-card-foreground rounded-xl p-6 shadow-md text-left border border-border">
            <p className="italic mb-4">
              “This platform made it so easy to connect with the right
              customers. We've seen real growth in just a few weeks.”
            </p>
            <div className="flex items-center gap-4">
              <Image
                src="/images/user1.jpg"
                alt="Alem Teshome"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-sm">Alem Teshome</p>
                <p className="text-xs text-muted-foreground">
                  Founder, AlemTech
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-card text-card-foreground rounded-xl p-6 shadow-md text-left border border-border">
            <p className="italic mb-4">
              “A game-changer for small business owners. Easy to use, great
              support, and results-driven.”
            </p>
            <div className="flex items-center gap-4">
              <Image
                src="/images/user2.jpg"
                alt="Sara Kedir"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-sm">Sara Kedir</p>
                <p className="text-xs text-muted-foreground">
                  Co-Founder, SaraCrafts
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-card text-card-foreground rounded-xl p-6 shadow-md text-left border border-border">
            <p className="italic mb-4">
              “We've been able to increase our exposure and customer base
              dramatically. Highly recommend it!”
            </p>
            <div className="flex items-center gap-4">
              <Image
                src="/images/user3.jpg"
                alt="Dawit Girma"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-sm">Dawit Girma</p>
                <p className="text-xs text-muted-foreground">
                  Marketing Lead, DG Solutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
