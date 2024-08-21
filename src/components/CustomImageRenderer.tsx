import Image from "next/image";

const CustomImageRenderer = ({ data }: { data: any }) => {
  const src = data.file?.url || data.url;
  const caption = data.caption || "";
  const stretched = data.stretched || false;
  const withBackground = data.withBackground || false;
  const withBorder = data.withBorder || false;

  let imageClasses = "max-w-full h-auto my-4";
  let containerClasses = "relative";

  if (stretched) {
    containerClasses += " w-full";
  } else {
    containerClasses += " max-w-2xl mx-auto";
  }

  if (withBackground) {
    containerClasses += " bg-gray-100 p-4";
  }

  if (withBorder) {
    imageClasses += " border border-gray-300";
  }

  return (
    <figure className={containerClasses}>
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {" "}
        {/* 16:9 aspect ratio */}
        <Image
          src={src}
          alt={caption}
          layout="fill"
          objectFit="contain"
          className={imageClasses}
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default CustomImageRenderer;
