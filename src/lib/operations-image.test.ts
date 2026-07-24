import { describe, expect, it } from "vitest";
import {
  EAGER_OPERATION_IMAGE_COUNT,
  getDesktopOperationFlatIndex,
  getOperationImageLoading,
  isEagerOperationImageIndex,
  isPriorityOperationImageIndex,
  OPERATION_IMAGE_SIZES,
} from "./operations-image";

describe("operations image loading policy", () => {
  it("marks the first six images as eager and only the first as priority", () => {
    expect(EAGER_OPERATION_IMAGE_COUNT).toBe(6);

    for (let index = 0; index < 6; index += 1) {
      expect(isEagerOperationImageIndex(index)).toBe(true);
      expect(getOperationImageLoading(index)).toBe("eager");
    }

    expect(isPriorityOperationImageIndex(0)).toBe(true);
    expect(isPriorityOperationImageIndex(1)).toBe(false);

    expect(isEagerOperationImageIndex(6)).toBe(false);
    expect(getOperationImageLoading(6)).toBe("lazy");
    expect(getOperationImageLoading(39)).toBe("lazy");
  });

  it("maps desktop bento coordinates to a stable flat gallery index", () => {
    expect(getDesktopOperationFlatIndex(0, 0, 0)).toBe(0);
    expect(getDesktopOperationFlatIndex(0, 0, 1)).toBe(1);
    expect(getDesktopOperationFlatIndex(0, 1, 0)).toBe(2);
    expect(getDesktopOperationFlatIndex(0, 1, 1)).toBe(3);
    expect(getDesktopOperationFlatIndex(1, 0, 0)).toBe(4);
    expect(getDesktopOperationFlatIndex(2, 1, 1)).toBe(11);
  });

  it("exposes responsive sizes for carousel, bento and expanded views", () => {
    expect(OPERATION_IMAGE_SIZES.mobileThumb).toBe("90vw");
    expect(OPERATION_IMAGE_SIZES.desktopThumb).toBe(
      "(max-width: 1024px) 30vw, 260px",
    );
    expect(OPERATION_IMAGE_SIZES.mobileExpand).toBe("100vw");
    expect(OPERATION_IMAGE_SIZES.desktopExpand).toBe(
      "(max-width: 1024px) 60vw, 720px",
    );
  });
});
