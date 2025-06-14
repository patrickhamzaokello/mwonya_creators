import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function Component() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Artist Audio Upload Guide</h1>
        <p className="text-lg text-gray-600">Get the Best Sound Quality</p>
      </div>

      {/* Why Upload High-Quality WAV Files */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Why Upload High-Quality WAV Files?</h2>
        <p className="text-gray-700 leading-relaxed">
          Your music deserves to sound amazing on every device and platform. Here's how our professional audio
          processing works and why starting with quality makes all the difference:
        </p>
      </section>

      {/* What Happens to Your Audio */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">What Happens to Your Audio</h2>
        <p className="text-gray-700">
          When you upload your track, our system performs several professional-grade processes:
        </p>

        <div className="space-y-6">
          <div className="border-l-2 border-blue-500 pl-6">
            <h3 className="font-medium text-lg mb-2 text-gray-900">Loudness Normalization</h3>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>We apply industry-standard EBU R128 normalization (-14 LUFS)</li>
              <li>This ensures your music sounds consistent with other tracks on streaming platforms</li>
              <li>Your dynamic range is preserved while achieving optimal loudness</li>
            </ul>
          </div>

          <div className="border-l-2 border-purple-500 pl-6">
            <h3 className="font-medium text-lg mb-2 text-gray-900">Multi-Format Conversion</h3>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>Your audio is converted to high-quality AAC (128 kbps)</li>
              <li>We create multiple streaming qualities: Low (48k), Medium (64k), High (128k)</li>
              <li>Adaptive streaming ensures the best quality for each listener's connection</li>
            </ul>
          </div>

          <div className="border-l-2 border-green-500 pl-6">
            <h3 className="font-medium text-lg mb-2 text-gray-900">Professional Segmentation</h3>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>Your track is segmented for smooth, buffer-free streaming</li>
              <li>Creates seamless playback across all devices and network conditions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* The Golden Rule */}
      <section className="bg-yellow-50 border border-yellow-200 p-6 rounded">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">The Golden Rule: Quality In = Quality Out</h2>
        <p className="text-gray-700">
          Each processing step can only work with what you give us. Think of it like photography - you can't enhance
          details that weren't captured in the original image.
        </p>
      </section>

      {/* Upload Recommendations */}
      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-green-700">✓ Upload WAV Files Because:</h2>
          <ul className="space-y-3 text-gray-700">
            <li>
              <strong>Uncompressed Audio:</strong> Contains all the original detail and dynamics
            </li>
            <li>
              <strong>Full Frequency Range:</strong> Preserves every nuance of your mix
            </li>
            <li>
              <strong>No Generation Loss:</strong> Our processing won't compound existing compression artifacts
            </li>
            <li>
              <strong>Professional Standard:</strong> What studios and mastering engineers use
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-red-700">✗ Avoid MP3/Compressed Files Because:</h2>
          <ul className="space-y-3 text-gray-700">
            <li>
              <strong>Already Processed:</strong> MP3 has already removed audio information permanently
            </li>
            <li>
              <strong>Double Compression:</strong> Processing compressed audio creates more artifacts
            </li>
            <li>
              <strong>Reduced Dynamics:</strong> Compression flattens the sound before we can optimize it
            </li>
            <li>
              <strong>Limited Headroom:</strong> Less flexibility for our loudness normalization
            </li>
          </ul>
        </section>
      </div>

      {/* What Your Listeners Get */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">What Your Listeners Get</h2>
        <p className="text-gray-700">After our processing, your fans will experience:</p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium text-gray-900">Consistent Loudness</h3>
            <p className="text-sm text-gray-600">Similar perceived volume across all tracks</p>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-medium text-gray-900">Adaptive Quality</h3>
            <p className="text-sm text-gray-600">Automatic quality adjustment based on connection</p>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-medium text-gray-900">Universal Compatibility</h3>
            <p className="text-sm text-gray-600">Works on all devices and platforms</p>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="best-practices" className="border-gray-200">
          <AccordionTrigger className="text-lg font-medium">Best Practices for Upload</AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Recommended Format:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Badge variant="outline" className="justify-center py-2">
                  WAV or AIFF
                </Badge>
                <Badge variant="outline" className="justify-center py-2">
                  24-bit preferred
                </Badge>
                <Badge variant="outline" className="justify-center py-2">
                  44.1/48 kHz
                </Badge>
                <Badge variant="outline" className="justify-center py-2">
                  Stereo
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Before You Upload:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Check your mix on different speakers</li>
                <li>Leave headroom - don't over-compress</li>
                <li>Trust our loudness optimization process</li>
                <li>Test your mix on various devices</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bottom-line" className="border-gray-200">
          <AccordionTrigger className="text-lg font-medium">The Bottom Line</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <p className="text-gray-700 font-medium">
              Your creativity and artistry deserve the best technical foundation.
            </p>
            <p className="text-gray-700">
              When you upload high-quality WAV files, you're giving us the full palette to work with. Our professional
              processing will:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Make your music sound consistent and competitive</li>
              <li>Ensure smooth streaming on any device or connection</li>
              <li>Preserve the artistic intent of your original mix</li>
              <li>Give your fans the best possible listening experience</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="real-impact" className="border-gray-200">
          <AccordionTrigger className="text-lg font-medium">Real Impact on Your Music</AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-green-700">WAV Upload</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>Rich source → Professional processing → Amazing result</p>
                  <p>Full dynamic range → Optimal loudness → Happy listeners</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-red-700">MP3 Upload</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>Compressed source → Limited processing → Compromised result</p>
                  <p>Artifacts amplified → Reduced clarity → Noticeable difference</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Final Message */}
      <section className="text-center space-y-4 py-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Your Music, Optimized</h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          Our system is designed by audio professionals who understand that great music starts with great source
          material. We're enhancing your files using the same standards as Spotify, Apple Music, and other major
          platforms.
        </p>
        <div className="text-lg font-medium text-gray-900">Upload WAV. Sound Professional. Reach More Fans.</div>
        <p className="text-sm text-gray-600">
          Have questions about audio formats or our processing? Contact our support team - we're here to help your music
          sound its best!
        </p>
      </section>
    </div>
  )
}
