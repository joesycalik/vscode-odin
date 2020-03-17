package main

import "core:fmt"
import "core:reflect"
//import "intrinsics"

/*	Block comments
	/* They can be nested */ Yep 
*/

when ODIN_OS == "windows" do foreign import kernel32 "system:kernel32.lib"
main :: proc() { // Comments // Nest
	{
		{ //Quaternion64, f16, f128 undeclared
			a : quaternion128; b : quaternion256; X :: cstring("\\ Test  \n");
			c : i8; d : i16; e : i32; f : i64; g : i128;
			h : f32; i : f64; j : bool; l : map[string]int;
			single_tick_string := '&'; back_tick_string := `Test`;
			constant_val_spread : int : 12; Foo :: enum {A, B, C};

			if y := 123; y < 0 {} else if y == 0 {}
			dyn_arr := [dynamic]int{1, 4, 9};
			defer delete(dyn_arr);
		}
		{
			loop: for x := 0; x < 1 ; do break loop;
			inline for x, i in 1..<4 {}

			q := 1 + 2i + 3j + 4k; a := transmute([4]f64)q;

			c := context; // copy the current scope's context
			context.user_index = 456;
		}
		{
			Vector3 :: struct {
				x: f32,
				y: f32,
				z: f32,
			};
			v_soa: #soa[3]Vector3 = {1, 4, 9};
			assert(v_soa[0].y == 4);
		}
		{
			Vector2 :: distinct [2] f64;
			a :: struct #align 4 {};
			b :: struct #packed	{};
			c :: struct #raw_union {};

			Entity :: struct {
				id:			u64,
				name:		string,
				position:	Vector2,
				a_val:		a,
				b_val:		b,
				c_val:		c,
				derived: any,
			};

			Frog :: struct {
				using entity: Entity,
				jump_height:  i32,
			};

			id := typeid_of(Frog);
			names := reflect.struct_field_names(id); // TODO: reflect is an imported lib?
		}
		{
			@(deprecated="This is how 'new' is implemented")
			alloc_type :: proc($T: typeid) -> ^T {
				t := cast(^T)alloc(size_of(T), align_of(T));
				t^ = T{}; // Use default initialization value
				return t;
			}
			cross_2d :: proc(a, b: $T/[2]$E, x : [2]int)
				where intrinsics.type_is_numeric(E), type_of(x) == [2]int {
				fmt.println(#procedure, "was called with the parameters", a, b);
			}

			@(deferred_out=closure)
			open :: proc(s: string) -> bool { return true; }
			closure :: proc(ok: bool) {}
		}
		{ // union		
			Foo :: union {int, bool};
			f : Foo = true; f = false; f = nil; f = 123;
			switch in f {
				case int:  
					x : bit_set['A'..'Z'];
					#assert(size_of(x) == size_of(u32));
					#partial switch in f { case bool: }
				case bool: 				
				case:
			}
		}
	}
}