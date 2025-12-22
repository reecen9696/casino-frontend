import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AboutPage {
  id: string;
  title: string;
  subtitle: string;
  sectionTitle: string;
  body: string;
}

interface TabsVerticalLinedProps {
  pages: AboutPage[];
  activePageId: string;
  onPageChange: (pageId: string) => void;
  formatBody: (body: string) => React.ReactNode;
}

const TabsVerticalLined = ({
  pages,
  activePageId,
  onPageChange,
  formatBody,
}: TabsVerticalLinedProps) => {
  const currentPage =
    pages.find((page) => page.id === activePageId) || pages[0];

  return (
    <div className="w-full flex gap-12">
      <Tabs
        value={activePageId}
        onValueChange={onPageChange}
        className="w-full flex gap-12"
      >
        {/* Content Section (Left) */}
        <div className="flex-1 max-w-4xl">
          <TabsContent
            value={activePageId}
            className="m-0 data-[state=inactive]:hidden"
          >
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
          </TabsContent>
        </div>

        {/* Tabs Section (Right) */}
        <div className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-8 pt-16">
            <TabsList className="bg-transparent h-auto flex-col items-start justify-start rounded-none p-0 space-y-0">
              {pages.map((page) => (
                <TabsTrigger
                  key={page.id}
                  value={page.id}
                  className="bg-transparent data-[state=active]:bg-transparent w-full justify-start rounded-none border-0 border-l-2 border-transparent data-[state=active]:border-white data-[state=active]:shadow-none text-white opacity-70 data-[state=active]:opacity-100 hover:opacity-100 transition-opacity font-aeonik text-sm px-3 py-2 h-auto"
                >
                  {page.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default TabsVerticalLined;
