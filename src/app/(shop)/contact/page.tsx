import Image from "next/image";
import Link from "next/link";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import Title from "@/components/common/Title";
import NewsletterBox from "@/components/common/NewsletterBox";

const storeName = "Aduti Store";
const address = "19F, Char Ampov, Phnom Penh, Cambodia";
const phone = "(088) 338 6537";
const email = "HengVanreuth@gmail.com";

const mapEmbedUrl =
  "https://www.google.com/maps?q=19F+Char+Ampov+Phnom+Penh+Cambodia&output=embed";
const openMapUrl =
  "https://www.google.com/maps/search/?api=1&query=19F+Char+Ampov+Phnom+Penh+Cambodia";

const Contact = () => {
  return (
    <div className="py-6 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t pt-10 text-center text-2xl">
          <Title text1="CONTACT" text2="US" />
        </div>

        <section className="mb-12 mt-10">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
              <Image
                src="/contact_img.png"
                className="h-auto w-full rounded-2xl object-cover"
                alt="Contact"
                width={800}
                height={500}
                priority
              />

              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-zinc-900">{storeName}</h2>
                <p className="text-sm leading-6 text-zinc-600">
                  We are here to support your shopping journey. Contact us for
                  orders, payment support, or partnership inquiries.
                </p>

                <div className="space-y-3 text-sm text-zinc-700">
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-zinc-900" />
                    <span>{address}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 text-zinc-900" />
                    <span>{phone}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-zinc-900" />
                    <span>{email}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-4 w-4 text-zinc-900" />
                    <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="rounded-full border border-zinc-900 px-6 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white">
                    Explore Jobs
                  </button>
                  <Link
                    href={openMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Open in Google Maps
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mb-12">
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
          <iframe
            src={mapEmbedUrl}
            title="Google map location"
            className="h-[85vh] min-h-[520px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default Contact;
