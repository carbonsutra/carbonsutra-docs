const productLinks = [
  {
    label: "Documentation",
    href: "/audience-and-intent",
  },
  {
    label: "Reference",
    href: "/api",
  },
  {
    label: "Try Now",
    href: "/api-playground",
  },
];

const connectLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/carbonsutra/",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@carbonsutra",
  },
  {
    label: "Contact",
    href: "mailto:support@carbonsutra.com?subject=Message%20for%20CarbonSutra",
  },
];

const accessLinks = [
  {
    label: "RapidAPI",
    href: "https://rapidapi.com/carbonsutra/api/carbonsutra1",
  },
  {
    label: "Postman",
    href: "https://documenter.getpostman.com/view/23339876/2sBY4SKxsd",
  },
  {
    label: "API.Market",
    href: "https://api.market/store/contactous/carbonsutra",
  },
  {
    label: "ZYLA",
    href: "https://zylalabs.com/api-marketplace/sustainability+%26+green+tech/carbon+emission+calculation+api/13723",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4 lg:gap-20 m-4 my-4">
          <div>
            <a href="/" className="inline-flex items-center no-underline">
              <img
                src="/images/logo.png"
                alt="CarbonSutra"
                className="h-10 w-auto object-contain"
              />
            </a>

            <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
              Carbon emission estimation APIs for travel, freight, vehicles,
              electricity, fuel, eCommerce and more.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>

            <ul className="mt-5 space-y-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Connect</h3>

            <ul className="mt-5 space-y-2">
              {connectLinks?.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={
                      link.href.startsWith("mailto:") ? undefined : "_blank"
                    }
                    rel={
                      link.href.startsWith("mailto:")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Access</h3>

            <ul className="mt-5 space-y-2">
              {accessLinks?.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border" />

        <div className="flex justify-center">
          <p className=" text-sm text-muted-foreground py-3">
            © {new Date().getFullYear()} Contactous Pte Ltd. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
