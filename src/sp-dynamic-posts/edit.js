import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
	__experimentalNumberControl,
	PanelBody,
	SelectControl,
	ToggleControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { dateI18n, format, getSettings } from "@wordpress/date";
import { RawHTML } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import "./editor.scss";

export default function Edit({ attributes, setAttributes }) {
	const { numberOfPosts, displayFeaturedImage, imageSize } = attributes;
	const posts = useSelect(
		(select) => {
			return select("core").getEntityRecords("postType", "post", {
				per_page: numberOfPosts,
				_embed: displayFeaturedImage,
			});
		},
		[numberOfPosts],
	);

	const imageSizes = useSelect(
		(select) => select("core/block-editor").getSettings()?.imageSizes,
		[],
	);

	const imageSizeOptions = imageSizes.map((size) => ({
		label: size.name,
		value: size.slug,
	}));

	const onChangeImageSize = (newSize) => {
		setAttributes({ imageSize: newSize });
	};

	const onChangeNumberOfPosts = (newNum) => {
		setAttributes({ numberOfPosts: newNum });
	};

	const handleDisplayFeaturedImageChange = (value) => {
		setAttributes({ displayFeaturedImage: value });
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
					<__experimentalNumberControl
						value={numberOfPosts}
						min={1}
						max={20}
						label={__("Number of posts", "sp-dynamic-posts")}
						placeholder={__("How many posts to show", "sp-dynamic-posts")}
						onChange={onChangeNumberOfPosts}
					/>

					<SelectControl
						label={__("Image Size", "sp-dynamic-posts")}
						options={imageSizeOptions}
						value={imageSize}
						onChange={onChangeImageSize}
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

					console.log(featuredImage);

					return (
						<li key={post.id}>
							{displayFeaturedImage && featuredImage && (
								<img
									src={
										featuredImage?.media_details?.sizes?.[imageSize]
											?.source_url || featuredImage?.source_url
									}
									alt={featuredImage?.alt_text}
								/>
							)}
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
							{post.date_gmt && (
								<time dateTime={format("c", post.date_gmt)}>
									{dateI18n(getSettings().formats.date, post.date_gmt)}
								</time>
							)}

							{post.excerpt.rendered && (
								<RawHTML>{post.excerpt.rendered}</RawHTML>
							)}
						</li>
					);
				})}
		</ul>
	);
}
