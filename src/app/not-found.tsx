import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full text-center">
        <Image
          src="/404 Error-pana.svg"
          alt="404 Not Found"
          width={500}
          height={500}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-orange-primary mb-2">
          Page Not Found
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-primary-foreground bg-orange-primary hover:bg-orange-accent rounded-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
