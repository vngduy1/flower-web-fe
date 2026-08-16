"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Alert, Button, Input, Skeleton } from "@/components/ui";
import { CatalogImage } from "@/features/products/components/catalog-image";
import type { ProductImage } from "@/features/products/types/product";
import { normalizeApiError } from "@/lib/api";

import {
  useAdminProductImages,
  useDeleteProductImage,
  useUpdateProductImage,
  useUploadProductImage,
} from "../hooks/use-admin-products";

function ImageCard({
  image,
  productId,
}: {
  image: ProductImage;
  productId: string;
}) {
  const update = useUpdateProductImage(productId);
  const remove = useDeleteProductImage(productId);

  const [altText, setAltText] = useState(image.altText ?? "");
  const [sortOrder, setSortOrder] = useState(image.sortOrder);

  const error = update.error ?? remove.error;

  return (
    <article className="border-brand/10 rounded-2xl border p-4">
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <CatalogImage
          src={image.thumbnailUrl || image.imageUrl}
          alt={image.altText ?? "商品画像"}
          sizes="(max-width: 640px) 100vw, 240px"
        />
      </div>

      <div className="mt-4 grid gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold">
            {image.isPrimary ? "メイン画像" : "追加画像"}
          </span>

          {!image.isPrimary ? (
            <Button
              size="sm"
              variant="secondary"
              isLoading={update.isPending}
              onClick={() =>
                update.mutate({
                  productId,
                  imageId: image.id,
                  isPrimary: true,
                })
              }
            >
              メインに設定
            </Button>
          ) : null}
        </div>

        <Input
          id={`image-alt-${image.id}`}
          label="代替テキスト"
          value={altText}
          maxLength={255}
          onChange={(event) => setAltText(event.target.value)}
        />

        <Input
          id={`image-sort-${image.id}`}
          label="並び順"
          type="number"
          min="0"
          max="9999"
          value={sortOrder}
          onChange={(event) => setSortOrder(Number(event.target.value))}
        />

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            isLoading={update.isPending}
            onClick={() =>
              update.mutate({
                productId,
                imageId: image.id,
                altText,
                sortOrder,
              })
            }
          >
            画像情報を保存
          </Button>

          <Button
            size="sm"
            variant="ghost"
            isLoading={remove.isPending}
            onClick={() => {
              if (window.confirm("この画像を削除しますか？")) {
                remove.mutate(image.id);
              }
            }}
          >
            削除
          </Button>
        </div>

        {error ? (
          <p className="text-sm text-red-700">
            {normalizeApiError(error).message}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function ProductImageManager({
  productId,
}: {
  productId: string;
}) {
  const images = useAdminProductImages(productId);
  const upload = useUploadProductImage(productId);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextSortOrder = useMemo(() => {
    const currentImages = images.data ?? [];

    if (currentImages.length === 0) {
      return 0;
    }

    return (
      Math.max(
        ...currentImages.map((image) => image.sortOrder ?? 0),
      ) + 1
    );
  }, [images.data]);

  const [files, setFiles] = useState<File[]>([]);
  const [altText, setAltText] = useState("");
  const [sortOrderOverride, setSortOrderOverride] =
    useState<number | null>(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  /*
   * Người dùng chưa tự thay đổi thứ tự:
   * dùng nextSortOrder được tính từ danh sách ảnh.
   *
   * Sau khi người dùng nhập:
   * dùng giá trị local.
   */
  const sortOrder = sortOrderOverride ?? nextSortOrder;

  const previews = useMemo(() => {
    return files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [files]);

  /*
   * Object URL là external browser resource,
   * vì vậy cleanup bằng useEffect là phù hợp.
   */
  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [previews]);

  function resetUploadForm() {
    setFiles([]);
    setAltText("");
    setSortOrderOverride(null);
    setIsPrimary(false);
    setProgress(0);
    setLocalError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    if (files.length === 0) {
      return;
    }

    setLocalError(null);

    const lastSortOrder = sortOrder + files.length - 1;

    if (sortOrder < 0 || lastSortOrder > 9999) {
      setLocalError(
        `並び順は0～9999の範囲で指定してください。${files.length}枚をアップロードする場合、開始番号は${Math.max(
          0,
          10000 - files.length,
        )}以下にしてください。`,
      );
      return;
    }

    setProgress(0);

    try {
      for (const [index, currentFile] of files.entries()) {
        await upload.mutateAsync({
          productId,
          file: currentFile,
          altText,
          sortOrder: sortOrder + index,
          isPrimary: index === 0 ? isPrimary : false,
          onProgress: (fileProgress) => {
            const completedProgress = index * 100;
            const totalProgress =
              (completedProgress + fileProgress) / files.length;

            setProgress(Math.round(totalProgress));
          },
        });
      }

      resetUploadForm();
    } catch {
      return;
    }
  }

  return (
    <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-brand-dark font-serif text-xl font-semibold">
        商品画像
      </h2>

      <p className="text-muted-foreground mt-2 text-sm">
        JPEG・PNG・WebP、1枚あたり最大10MB。複数の画像をまとめて選択できます。
        最初の画像は自動的にメインになります。
      </p>

      <form
        className="bg-brand-soft/20 mt-5 grid gap-5 rounded-2xl p-4"
        onSubmit={submit}
      >
        <div className="grid gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            required
            onChange={(event) => {
              const selectedFiles = Array.from(
                event.target.files ?? [],
              );

              setFiles(selectedFiles);
              setLocalError(null);

              /*
               * Ảnh vừa được chọn sẽ bắt đầu từ thứ tự
               * hiện tại của danh sách ảnh.
               */
              setSortOrderOverride(nextSortOrder);
            }}
            className="text-sm"
          />

          {files.length > 0 ? (
            <p className="text-muted-foreground text-xs">
              {files.length}枚選択されています
            </p>
          ) : null}
        </div>

        {previews.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {previews.map((preview, index) => (
              <div
                key={`${preview.file.name}-${preview.file.lastModified}-${index}`}
                className="border-brand/10 overflow-hidden rounded-xl border bg-white"
              >
                <div
                  role="img"
                  aria-label={`${preview.file.name} のプレビュー`}
                  className="aspect-square bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${preview.url})`,
                  }}
                />

                <div className="p-2">
                  <p
                    className="truncate text-xs font-medium"
                    title={preview.file.name}
                  >
                    {preview.file.name}
                  </p>

                  <p className="text-muted-foreground mt-1 text-xs">
                    並び順: {sortOrder + index}
                  </p>

                  {index === 0 && isPrimary ? (
                    <p className="mt-1 text-xs font-semibold">
                      メイン画像
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-muted grid h-40 place-items-center rounded-xl text-sm">
            プレビュー
          </div>
        )}

        <div className="grid gap-3">
          <Input
            id="new-image-alt"
            label="代替テキスト"
            maxLength={255}
            value={altText}
            onChange={(event) =>
              setAltText(event.target.value)
            }
          />

          <p className="text-muted-foreground -mt-2 text-xs">
            選択したすべての画像に同じ代替テキストが設定されます。
          </p>

          <Input
            id="new-image-sort"
            label="開始する並び順"
            type="number"
            min="0"
            max="9999"
            value={sortOrder}
            onChange={(event) =>
              setSortOrderOverride(Number(event.target.value))
            }
          />

          {files.length > 1 ? (
            <p className="text-muted-foreground -mt-2 text-xs">
              {files.length}枚の画像には、{sortOrder}～
              {sortOrder + files.length - 1}
              の順番が自動的に設定されます。
            </p>
          ) : null}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(event) =>
                setIsPrimary(event.target.checked)
              }
            />
            先頭の画像をメイン画像にする
          </label>

          {upload.isPending ? (
            <div>
              <progress
                className="w-full"
                max="100"
                value={progress}
              />

              <p className="text-muted-foreground text-xs">
                アップロード中 {progress}%
              </p>
            </div>
          ) : null}

          {localError ? (
            <Alert variant="error">
              {localError}
            </Alert>
          ) : null}

          <Button
            type="submit"
            isLoading={upload.isPending}
            disabled={files.length === 0}
          >
            {files.length > 1
              ? `${files.length}枚をアップロード`
              : "アップロード"}
          </Button>

          {upload.error ? (
            <Alert variant="error">
              {normalizeApiError(upload.error).message}
            </Alert>
          ) : null}
        </div>
      </form>

      {images.isPending ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-80 rounded-2xl"
            />
          ))}
        </div>
      ) : null}

      {images.error ? (
        <Alert
          className="mt-5"
          variant="error"
        >
          画像一覧を読み込めませんでした。

          <Button
            size="sm"
            className="mt-3"
            onClick={() => void images.refetch()}
          >
            再試行
          </Button>
        </Alert>
      ) : null}

      {images.data?.length === 0 ? (
        <p className="text-muted-foreground mt-5 text-sm">
          画像はまだ登録されていません。
        </p>
      ) : null}

      {images.data?.length ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.data.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              productId={productId}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}