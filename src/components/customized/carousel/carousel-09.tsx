"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CarouselWithThumbs(props:any) {
    const { images } = props
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
    if (!api) {
        return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1);
    });
    }, [api]);

    const handleThumbClick = React.useCallback(
    (index: number) => {
        api?.scrollTo(index);
    },
    [api]
    );

  return (
    <div className="mx-auto max-w-xs">
        <Carousel className="w-full max-w-xs" setApi={setApi}>
            <CarouselContent>
                {images.map((image:any, index:any) => (
                <CarouselItem key={index}>
                    <Card>
                        <CardContent className="p-2 aspect-video">
                            {/* <span className="font-semibold text-4xl">{index + 1}</span> */}
                            <img src={image.url} alt={`image #${34511}`} className="m-0 w-full" />
                        </CardContent>
                    </Card>
                </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>

        <Carousel className="mt-4 w-full max-w-xs">
            <CarouselContent className="my-1 flex">
                {images.map((image:any, index:any) => (
                <CarouselItem
                    className={cn(
                    "basis-1/4 cursor-pointer",
                    current === index + 1 ? "opacity-100" : "opacity-50"
                    )}
                    key={index}
                    onClick={() => handleThumbClick(index)}
                >
                    <Card className="flex aspect-square items-center justify-center p-0">
                        <CardContent className="p-0 h-fit w-fit">
                            {/* <div className="font-semibold text-2xl">{index + 1}</div> */}
                            <img src={image.url} alt={`image #${34511}`} className="m-0 w-full" />
                        </CardContent>
                    </Card>
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    </div>
    );
}
