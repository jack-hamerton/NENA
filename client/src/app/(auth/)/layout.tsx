export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col bg-muted/30 p-10 text-white">
        <div className="absolute inset-0 bg-nena-atmosphere" />
        <div className="relative z-20 flex items-center text-2xl font-bold">
          <span className="text-primary">NENA</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;NENA has completely transformed how I share my digital art and connect with fellow creators in Nairobi.&rdquo;
            </p>
            <footer className="text-sm font-medium">Sandra Wanjiku</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center p-4">
        <div className="w-full mx-auto max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
