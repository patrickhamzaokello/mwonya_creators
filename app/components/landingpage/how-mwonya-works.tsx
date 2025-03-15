import { Upload, Users, BarChart } from "lucide-react"

export default function HowMwonyaWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload Your Music",
      description:
        "Easily upload your tracks, albums, and projects. Our platform supports high-quality audio and integrates seamlessly with your catalog.",
      icon: Upload,
      color: "bg-black",
      features: [
        "Unlimited uploads for artists",
        "Support for all major audio formats",
        "Automated metadata optimization",
      ],
    },
    {
      number: "02",
      title: "Connect With Fans",
      description:
        "Build your audience with powerful tools. Create subscription tiers, exclusive content, and direct messaging to strengthen fan relationships.",
      icon: Users,
      color: "bg-black",
      features: [
        "Custom artist profile and fan community",
        "Subscription and membership models",
        "Direct messaging and announcements",
      ],
    },
    {
      number: "03",
      title: "Track Your Revenue and Growth",
      description:
        "Gain insights with comprehensive analytics. Monitor streams, revenue, audience demographics, and engagement metrics in real-time.",
      icon: BarChart,
      color: "bg-black",
      features: [
        "Detailed streaming and revenue analytics",
        "Audience demographics and location data",
        "Performance trends and growth insights",
      ],
    },
  ]

  return (
    <section className="py-24 bg-yellow-300">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-5xl font-bold mb-6 text-black">How Mwonya Works</h2>
          <p className="text-black text-xl">Empower Ugandan artists with tools to build sustainable music careers.</p>
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left side: Visual representation */}
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <div
                  className={`relative aspect-square max-w-md mx-auto rounded-3xl bg-yellow-200 border-2 border-black shadow-lg p-8 flex items-center justify-center`}
                >
                  <div className={`h-40 w-40 rounded-full bg-yellow-100 p-8 flex items-center justify-center`}>
                    <div className={`h-full w-full rounded-full ${step.color} flex items-center justify-center`}>
                      <step.icon className="h-14 w-14 text-yellow-300" />
                    </div>
                  </div>

                  {/* Large step number */}
                  <div className="absolute -top-10 -left-10 h-20 w-20 rounded-full bg-black border-2 border-yellow-300 shadow-lg flex items-center justify-center">
                    <span className="text-3xl font-bold text-yellow-300">{step.number}</span>
                  </div>
                </div>
              </div>

              {/* Right side: Step details */}
              <div className={`space-y-6 ${index % 2 === 1 ? "md:order-1 md:text-right" : ""}`}>
                <h3 className="text-4xl font-bold text-black">{step.title}</h3>

                <p className="text-black text-xl leading-relaxed">{step.description}</p>

                <ul className="space-y-4">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={`flex items-start ${index % 2 === 1 ? "md:justify-end" : ""}`}>
                      <div
                        className={`h-6 w-6 rounded-full ${step.color} flex items-center justify-center text-yellow-300 text-sm font-bold mt-1 flex-shrink-0`}
                      >
                        ✓
                      </div>
                      <span className={`${index % 2 === 1 ? "md:mr-3" : "ml-3"} text-black text-lg`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

