<svelte:head><title>foukalma. | work</title></svelte:head>

<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
</script>

<section class="mx-auto w-full max-w-3xl px-6 py-16">
	<h1 class="text-foreground text-3xl font-bold tracking-tight">Experience</h1>

	<h2 class="text-foreground mt-10 text-xl font-semibold">Work</h2>
	<div class="border-muted-foreground/20 mt-6 border-l-2 pl-6">
		<div class="relative pb-8">
			<div class="bg-foreground absolute -left-[31px] top-1.5 h-3 w-3 rounded-full"></div>
			<p class="text-muted-foreground text-xs uppercase tracking-wide">07/2025 - Present</p>
			<h3 class="text-foreground mt-1 text-base font-medium">Software Engineer - OCI, Oracle</h3>
			<p class="text-muted-foreground mt-2 text-sm leading-relaxed">
				I work on backend services within Oracle Cloud Infrastructure, contributing to the delivery of OCI Batch from Limited Availability to General Availability. My role involves extending core Java APIs, working with Micronaut-based services, and collaborating closely with the Micronaut team on framework-level topics. Alongside application development, I’ve gained hands-on experience with cloud infrastructure and infrastructure-as-code using Terraform, all within an Agile Scrum environment.
			</p>
		</div>
		<div class="relative">
			<div class="bg-muted-foreground absolute -left-[31px] top-1.5 h-3 w-3 rounded-full"></div>
			<p class="text-muted-foreground text-xs uppercase tracking-wide">06/2024 — 09/2024</p>
			<h3 class="text-foreground mt-1 text-base font-medium">Web Developer - Greenpanda</h3>
			<p class="text-muted-foreground mt-2 text-sm leading-relaxed">
				I worked on building responsive, production-ready web apps using SvelteKit, translating designs directly from Figma into optimized frontends.
			</p>
		</div>
	</div>

	<Separator class="my-10" />

	<h2 class="text-foreground text-xl font-semibold">Education</h2>
	<div class="border-muted-foreground/20 mt-6 border-l-2 pl-6">
		<div class="relative pb-8">
			<div class="bg-foreground absolute -left-[31px] top-1.5 h-3 w-3 rounded-full"></div>
			<p class="text-muted-foreground text-xs uppercase tracking-wide">09/2025 - Present</p>
			<h3 class="text-foreground mt-1 text-base font-medium">MSc Data and Software Engineering</h3>
			<p class="text-muted-foreground mt-1 text-sm">Charles University (Matfyz), Prague</p>
			<p class="text-muted-foreground mt-2 text-sm leading-relaxed">
				I am currently pursuing a master’s degree focused on data-centric software systems, with an emphasis on information retrieval, large-scale data processing, and applied machine learning
			</p>
		</div>
		<div class="relative">
			<div class="bg-muted-foreground absolute -left-[31px] top-1.5 h-3 w-3 rounded-full"></div>
			<p class="text-muted-foreground text-xs uppercase tracking-wide">09/2022 - 09/2025</p>
			<h3 class="text-foreground mt-1 text-base font-medium">BSc Computer Science - Web and Data Oriented Programming</h3>
			<p class="text-muted-foreground mt-1 text-sm">Charles University (Matfyz), Prague</p>
			<p class="text-muted-foreground mt-2 text-sm leading-relaxed">
				During my bachelor’s studies, I built a strong foundation in computer science with a focus on data engineering, distributed systems, semantic web, and linked data. My bachelor’s thesis, Interactive web-based voting application, was nominated for the Dean’s Award.	
			</p>
		</div>
	</div>
</section>
