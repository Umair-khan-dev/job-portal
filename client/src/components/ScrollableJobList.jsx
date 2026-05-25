function ScrollableJobList({ title, children, emptyMessage, maxHeight = "max-h-[65vh]" }) {
  return (
    <div className="bg-white rounded-lg shadow flex flex-col">
      {title && (
        <div className="p-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-lg z-10">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div
        className={`overflow-y-auto overflow-x-hidden p-4 ${maxHeight} scroll-smooth`}
        style={{ scrollbarGutter: "stable" }}
      >
        {children}
      </div>
    </div>
  );
}

export default ScrollableJobList;
