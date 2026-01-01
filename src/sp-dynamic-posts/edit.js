import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
	__experimentalNumberControl,
	PanelBody,
	SelectControl,
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

	const onChangeNumberOfPosts = (newNum) => {
		setAttributes({ numberOfPosts: newNum });
	};

	const imageSizes = useSelect(
		(select) => select("core/block-editor").getSettings()?.imageSizes,
		[],
	);

	console.log(imageSizes);
	console.log(posts);

	return (
		<ul {...useBlockProps()}>
			<InspectorControls>
				<PanelBody>
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
						options={[
							{ label: "A", value: "a" },
							{ label: "B", value: "b" },
							{ label: "C", value: "c" },
						]}
						value={"a"}
					/>
				</PanelBody>
			</InspectorControls>

			{posts &&
				posts?.map((post) => {
					const title = post?.title?.rendered;
					const featuredImage = post?._embedded?.["wp:featuredmedia"]?.[0];
					return (
						<li key={post.id}>
							<img
								src={featuredImage?.media_details.sizes[imageSize].source_url}
								alt={featuredImage?.alt_text}
							/>
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
