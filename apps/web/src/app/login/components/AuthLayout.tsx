'use client';

import CarouselSection from './CarouselSection';
import FormSection from './FormSection';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Carousel (hidden on mobile, visible on desktop) */}
      <div className="hidden md:flex md:w-1/2">
        <CarouselSection />
      </div>

      {/* Right side - Form (full width on mobile, half on desktop) */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 md:w-1/2 bg-gray-50">
        <div className="w-full max-w-sm md:max-w-md">
          <FormSection />
        </div>
      </div>
    </div>
  );
}