ENGINE FEATURES
VM
	async,wait			.		.
	emit, on			.		.
I/O
	common (url...)		.		.
	image				.		.
	text				.		.
Graphics				.		.
	plot 2d/3d			.		.
	geometry 2d/3d		.		.
	simulator 2d/3d/4d	.		.


-----------------------
ENGINE TODO
-----------------------
	status:created, running, stopped, paused, wait_async
	current_asyncs:AsyncRecord[]
	AsyncRecord:{
			instr_cursor,
			wait_instr_cursor
		}
	WaitAsyncRecord:{
			wait_instr_cursor,
			async_vars:[]
		}