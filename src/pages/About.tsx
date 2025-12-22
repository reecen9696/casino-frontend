import React, { useState } from "react";
import aboutPagesData from "../data/aboutPages.json";
import TabsVerticalLined from "../components/TabsVerticalLined";

interface AboutPage {
  id: string;
  title: string;
  subtitle: string;
  sectionTitle: string;
  body: string;
}

const About: React.FC = () => {
  const [activePageId, setActivePageId] = useState<string>("intro");
  const aboutPages: AboutPage[] = aboutPagesData.aboutPages;

  const currentPageIndex = aboutPages.findIndex(
    (page) => page.id === activePageId
  );
  const currentPage = aboutPages[currentPageIndex];

  // Loop navigation: previous wraps to last page, next wraps to first page
  const previousPage =
    currentPageIndex > 0
      ? aboutPages[currentPageIndex - 1]
      : aboutPages[aboutPages.length - 1];
  const nextPage =
    currentPageIndex < aboutPages.length - 1
      ? aboutPages[currentPageIndex + 1]
      : aboutPages[0];

  const handlePageChange = (pageId: string) => {
    setActivePageId(pageId);
  };

  const formatBody = (body: string) => {
    return body.split("\n\n").map((paragraph, index) => (
      <p
        key={index}
        className="mb-4 text-base font-aeonik text-white opacity-80 leading-relaxed"
      >
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Desktop Layout with Tabs */}
      <div className="hidden lg:block">
        <TabsVerticalLined
          pages={aboutPages}
          activePageId={activePageId}
          onPageChange={handlePageChange}
          formatBody={formatBody}
        />

        {/* Bottom Navigation for Desktop */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-8 max-w-4xl">
          {/* Previous */}
          <div className="flex-1">
            <button
              onClick={() => handlePageChange(previousPage.id)}
              className="group text-left"
            >
              <div className="text-sm font-aeonik text-white opacity-50 mb-1">
                Previous
              </div>
              <div className="text-base font-aeonik text-white group-hover:text-gray-300 transition-colors">
                {previousPage.title}
              </div>
            </button>
          </div>

          {/* Next */}
          <div className="flex-1 text-left sm:text-right">
            <button
              onClick={() => handlePageChange(nextPage.id)}
              className="group text-left sm:text-right"
            >
              <div className="text-sm font-aeonik text-white opacity-50 mb-1">
                Next
              </div>
              <div className="text-base font-aeonik text-white group-hover:text-gray-300 transition-colors">
                {nextPage.title}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="flex flex-col gap-8">
          {/* Mobile Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
            {aboutPages.map((page) => (
              <button
                key={page.id}
                onClick={() => handlePageChange(page.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-aeonik transition-colors ${
                  page.id === activePageId
                    ? "text-white"
                    : "text-white opacity-70 hover:opacity-100"
                }`}
              >
                {page.title}
              </button>
            ))}
          </div>

          {/* Mobile Content */}
          <div className="max-w-none">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-aeonik text-white mb-2">
                {currentPage.title}
              </h1>
              <p className="text-base font-aeonik text-white opacity-70">
                {currentPage.subtitle}
              </p>
            </div>

            {/* Section Title */}
            <h2 className="text-xl font-bold font-aeonik text-white mb-6">
              {currentPage.sectionTitle}
            </h2>

            {/* Body Content */}
            <div className="mb-12">{formatBody(currentPage.body)}</div>

            {/* Bottom Navigation for Mobile */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-8">
              {/* Previous */}
              <div className="flex-1">
                <button
                  onClick={() => handlePageChange(previousPage.id)}
                  className="group text-left"
                >
                  <div className="text-sm font-aeonik text-white opacity-50 mb-1">
                    Previous
                  </div>
                  <div className="text-base font-aeonik text-white group-hover:text-gray-300 transition-colors">
                    {previousPage.title}
                  </div>
                </button>
              </div>

              {/* Next */}
              <div className="flex-1 text-left sm:text-right">
                <button
                  onClick={() => handlePageChange(nextPage.id)}
                  className="group text-left sm:text-right"
                >
                  <div className="text-sm font-aeonik text-white opacity-50 mb-1">
                    Next
                  </div>
                  <div className="text-base font-aeonik text-white group-hover:text-gray-300 transition-colors">
                    {nextPage.title}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
