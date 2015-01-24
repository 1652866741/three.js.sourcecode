/**
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Cube.as
 */
/*
///BoxGeometry用来在三维空间内创建一个立方体盒子对象.
///
///	用法: var geometry = new THREE.BoxGeometry(1,1,1);	
/// 	  var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
/// 	  var cube = new THREE.Mesh(geometry,material);
/// 	  scene.add(cube);
*/
///<summary>BoxGeometry</summary>
///<param name ="width" type="float">立方体宽度</param>
///<param name ="height" type="float">立方体高度</param>
///<param name ="depth" type="float">立方体深度</param>
///<param name ="widthSegments" type="int">立方体宽度细分线段数</param>
///<param name ="heightSegments" type="int">立方体高度细分线段数</param>
///<param name ="depthSegments" type="int">立方体深度细分线段数</param>
THREE.BoxGeometry = function ( width, height, depth, widthSegments, heightSegments, depthSegments ) {

	THREE.Geometry.call( this );	//调用Geometry对象的call方法,将原本属于Geometry的方法交给当前对象BoxGeometry来使用.

	this.parameters = {
		width: width,
		height: height,
		depth: depth,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		depthSegments: depthSegments
	};

	this.widthSegments = widthSegments || 1;
	this.heightSegments = heightSegments || 1;
	this.depthSegments = depthSegments || 1;

	var scope = this;

	var width_half = width / 2;
	var height_half = height / 2;
	var depth_half = depth / 2;

	buildPlane( 'z', 'y', - 1, - 1, depth, height, width_half, 0 ); // px 
	buildPlane( 'z', 'y',   1, - 1, depth, height, - width_half, 1 ); // nx
	buildPlane( 'x', 'z',   1,   1, width, depth, height_half, 2 ); // py
	buildPlane( 'x', 'z',   1, - 1, width, depth, - height_half, 3 ); // ny
	buildPlane( 'x', 'y',   1, - 1, width, height, depth_half, 4 ); // pz
	buildPlane( 'x', 'y', - 1, - 1, width, height, - depth_half, 5 ); // nz

	///<summary>buildPlane</summary>
	///<param name ="u" type="String">取值范围"x,y,z",表示从构建面的u坐标与xyz坐标的映射</param>
	///<param name ="v" type="String">取值范围"x,y,z",表示从构建面的v坐标与xyz坐标的映射</param>
	///<param name ="udir" type="float">为计算平面u方向上的顶点与原点的方向</param>
	///<param name ="vdir" type="float">为计算平面v方向上的顶点与原点的方向</param>
	///<param name ="width" type="float">立方体宽度</param>
	///<param name ="height" type="float">立方体高度</param>
	///<param name ="depth" type="float">立方体深度的一半(why?应为立方体是以中心点为原点!)</param>
	///<param name ="materialIndex" type="int">材质索引号</param>
	function buildPlane( u, v, udir, vdir, width, height, depth, materialIndex ) {

		var w, ix, iy,
		gridX = scope.widthSegments,
		gridY = scope.heightSegments,
		width_half = width / 2,
		height_half = height / 2,
		offset = scope.vertices.length;
		//通过参数uv确定w坐标,用来确定面的方向,想象一下立方体有六个面,通过buildPlane来构建三角面.
		if ( ( u === 'x' && v === 'y' ) || ( u === 'y' && v === 'x' ) ) {

			w = 'z';

		} else if ( ( u === 'x' && v === 'z' ) || ( u === 'z' && v === 'x' ) ) {

			w = 'y';
			gridY = scope.depthSegments;

		} else if ( ( u === 'z' && v === 'y' ) || ( u === 'y' && v === 'z' ) ) {

			w = 'x';
			gridX = scope.depthSegments;

		}

		var gridX1 = gridX + 1,
		gridY1 = gridY + 1,
		segment_width = width / gridX,
		segment_height = height / gridY,
		normal = new THREE.Vector3();

		normal[ w ] = depth > 0 ? 1 : - 1;

		for ( iy = 0; iy < gridY1; iy ++ ) {	//这里在构建几何体时非常重要,通过用户给定的参数,计算出顶点,这些顶点的顺序,要在下面使用.
												//如果要自己定义几何体对象,计算顶点,和三角面是必不可少的.这里需要用户对顶点的存储顺序和面的构建顺序,在头脑中有清晰的几何形象.多做练习吧.

			for ( ix = 0; ix < gridX1; ix ++ ) {

				var vector = new THREE.Vector3();
				vector[ u ] = ( ix * segment_width - width_half ) * udir;
				vector[ v ] = ( iy * segment_height - height_half ) * vdir;
				vector[ w ] = depth;

				scope.vertices.push( vector );	//通过长宽高,方向,线段数计算出顶点的坐标.

			}

		}

		for ( iy = 0; iy < gridY; iy ++ ) {	//这里是构建几何体非常重要的一步,根据一个一个的三角面拼成立方体一个面

			for ( ix = 0; ix < gridX; ix ++ ) {
				//计算组成立方体面的矩形的四个顶点,a,b,c,d,我经常误理解为a,b,c,d,4条边,这里应该是学的几何知识影响的我.
				var a = ix + gridX1 * iy;
				var b = ix + gridX1 * ( iy + 1 );
				var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = ( ix + 1 ) + gridX1 * iy;

				var uva = new THREE.Vector2( ix / gridX, 1 - iy / gridY );
				var uvb = new THREE.Vector2( ix / gridX, 1 - ( iy + 1 ) / gridY );
				var uvc = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - ( iy + 1 ) / gridY );
				var uvd = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - iy / gridY );

				var face = new THREE.Face3( a + offset, b + offset, d + offset );	//构建的a,b,c3个顶点组成的三角面
				face.normal.copy( normal );
				face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );	//计算面的法向量
				face.materialIndex = materialIndex;	//赋值面的材质索引

				scope.faces.push( face );
				scope.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );

				face = new THREE.Face3( b + offset, c + offset, d + offset );	//构建的b,c,d,3个顶点组成的三角面,一个平面有两个三角面,都见过吧.
				face.normal.copy( normal );
				face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );	//计算面的法向量
				face.materialIndex = materialIndex;	//赋值面的材质索引

				scope.faces.push( face );
				scope.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc, uvd.clone() ] );

			}

		}

	}

	this.mergeVertices();	//mergeVertices方法用来清理几何体中重复的顶点

};
/*************************************************
****下面是BoxGeometry对象的方法属性定义,继承自Geometry对象.
**************************************************/
THREE.BoxGeometry.prototype = Object.create( THREE.Geometry.prototype );
