import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
	__experimentalNumberControl,
	PanelBody,
	QueryControls,
	SelectControl,
	ToggleControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { dateI18n, format, getSettings } from "@wordpress/date";
import { RawHTML } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import "./editor.scss";
import { TextareaControl } from "@wordpress/components";
import { TextControl } from "@wordpress/components";

export default function Edit({ attributes, setAttributes }) {
	const {
		numberOfPosts,
		displayFeaturedImage,
		imageSize,
		order,
		orderBy,
		category,
		excerptLength,
		showDate,
	} = attributes;

	const posts = useSelect(
		(select) => {
			return select("core").getEntityRecords("postType", "post", {
				per_page: numberOfPosts,
				_embed: displayFeaturedImage,
				order,
				orderby: orderBy,
				...(category ? { categories: category } : {}),
			});
		},
		[numberOfPosts, order, orderBy, category],
	);

	const imageSizes = useSelect(
		(select) => select("core/block-editor").getSettings()?.imageSizes,
		[],
	);

	const imageSizeOptions = imageSizes.map((size) => ({
		label: size.name,
		value: size.slug,
	}));

	const categories = useSelect((select) =>
		select("core").getEntityRecords("taxonomy", "category", { per_page: -1 }),
	);
	const categoriesList =
		categories &&
		categories.map((category) => ({
			id: category.id,
			name: category.name,
			parent: category.parent,
		}));

	const onChangeImageSize = (newSize) => {
		setAttributes({ imageSize: newSize });
	};

	const onChangeNumberOfPosts = (newNum) => {
		setAttributes({ numberOfPosts: Number(newNum) });
	};

	const handleDisplayFeaturedImageChange = (value) => {
		setAttributes({ displayFeaturedImage: value });
	};

	const handleOrderByChange = (newOrderBy) => {
		setAttributes({ orderBy: newOrderBy });
	};
	const handleOrderChange = (newOrder) => {
		setAttributes({ order: newOrder });
	};

	const handleOnCategoryChange = (newCategory) => {
		setAttributes({ category: Number(newCategory) || 0 });
	};

	const handleToggleShowDate = (value) => {
		setAttributes({ showDate: value });
	};

	const onChangeExcerptLength = (newLength) => {
		setAttributes({ excerptLength: newLength });
	};

	return (
		<ul {...useBlockProps()}>
			<InspectorControls>
				<PanelBody>
					<ToggleControl
						label={__("Display Featured Image", "sp-dynamic-posts")}
						checked={displayFeaturedImage}
						onChange={handleDisplayFeaturedImageChange}
					/>
					<ToggleControl
						label={__("Show date", "sp-dynamic-posts")}
						checked={showDate}
						onChange={handleToggleShowDate}
					/>
					<__experimentalNumberControl
						value={numberOfPosts}
						min={1}
						max={20}
						label={__("Number of posts", "sp-dynamic-posts")}
						placeholder={__("How many posts to show", "sp-dynamic-posts")}
						onChange={onChangeNumberOfPosts}
					/>

					<QueryControls
						order={order}
						orderBy={orderBy}
						onOrderChange={handleOrderChange}
						onOrderByChange={handleOrderByChange}
						categoriesList={categoriesList}
						selectedCategoryId={category || ""}
						onCategoryChange={handleOnCategoryChange}
					/>

					<SelectControl
						label={__("Image size", "sp-dynamic-posts")}
						options={imageSizeOptions}
						value={imageSize}
						onChange={onChangeImageSize}
					/>

					<__experimentalNumberControl
						value={excerptLength}
						min={8}
						max={60}
						label={__("Excerpt Length", "sp-dynamic-posts")}
						placeholder={__("Post's content length", "sp-dynamic-posts")}
						onChange={onChangeExcerptLength}
					/>
				</PanelBody>
			</InspectorControls>

			{posts &&
				posts?.map((post) => {
					const title = post?.title?.rendered;
					const featuredImage =
						post._embedded &&
						post._embedded["wp:featuredmedia"] &&
						post._embedded["wp:featuredmedia"].length > 0 &&
						post._embedded["wp:featuredmedia"][0];

					const excerptText = post.excerpt.rendered
						.split(" ")
						.splice(0, excerptLength)
						.join(" ");
					const contentLn = post.content.rendered.split(" ").length;

					return (
						<li key={post.id}>
							<h3>
								{" "}
								<a href={post.link}>
									{title ? (
										<RawHTML>{title}</RawHTML>
									) : (
										__("No title", "sp-dynamic-posts")
									)}
								</a>{" "}
							</h3>
							{showDate && post.date_gmt && (
								<time dateTime={format("c", post.date_gmt)}>
									{dateI18n(getSettings().formats.date, post.date_gmt)}
								</time>
							)}

							{displayFeaturedImage && featuredImage && (
								<img
									src={
										featuredImage?.media_details?.sizes?.[imageSize]
											?.source_url || featuredImage?.source_url
									}
									alt={featuredImage?.alt_text}
								/>
							)}

							{post.excerpt.rendered && (
								<RawHTML>
									{excerptText}{" "}
									{contentLn > excerptLength
										? "<span className='sp-read-more'>...Read more</span>"
										: ""}
								</RawHTML>
							)}
						</li>
					);
				})}
		</ul>
	);
}
