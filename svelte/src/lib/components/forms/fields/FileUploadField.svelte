<script lang="ts">
	// -- FileUploadField: input file — lưu File object vào form store để gửi lên server
	import { Input } from '$lib/components/ui/input/index.js';

	interface FileUploadFieldProps {
		name: string;
		form: any;
	}

	const { name, form }: FileUploadFieldProps = $props();

	// formData là superForm store — const vì superForm snapshot lúc init
	const { form: formData } = form;

	// Khi chọn file, lưu File object vào $formData để FormBuilder gửi qua FormData
	const onFileChange = (e: Event) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		$formData[name] = file;
	};
</script>

<Input type="file" id={name} onchange={onFileChange} />
